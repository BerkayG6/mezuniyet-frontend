from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import base64
from io import BytesIO
from typing import List, Dict
import json
import traceback

app = FastAPI()

# Add CORS middleware with specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set the style for all plots
plt.style.use('seaborn-v0_8')
sns.set_theme(style="whitegrid")

def create_visualization(data: Dict):
    try:
        print("Received data:", json.dumps(data, indent=2))
        
        departments = pd.DataFrame(data["departments"])
        options = data["options"]
        
        # Create combined labels for departments with year
        departments['label'] = departments.apply(
            lambda x: f"{x['university']}\n{x['name']}\n({x['year']})", 
            axis=1
        )
        
        print("DataFrame created:", departments.head())
        
        # Create figure with subplots based on selected options
        num_options = sum(options.values())
        if num_options == 0:
            return None
            
        # Calculate grid layout
        if num_options <= 2:
            rows, cols = 1, num_options
        else:
            rows = (num_options + 1) // 2
            cols = 2
        
        print(f"Creating figure with {rows}x{cols} layout")
        
        # Increase figure size to accommodate longer labels
        fig = plt.figure(figsize=(18, 5*rows))
        fig.suptitle('Bölüm Analizleri', fontsize=16, y=0.95)
        
        plot_count = 1
        
        # Set the color palette
        colors = sns.color_palette("husl", 8)
        
        if options["fieldRate"]:
            print("Creating field rate plot")
            ax = plt.subplot(rows, cols, plot_count)
            sns.barplot(data=departments, x='label', y='fieldRate', ax=ax, color=colors[0])
            ax.set_title('Doluluk Oranı (%)')
            ax.set_xlabel('')
            ax.set_ylabel('Doluluk Oranı (%)')
            plt.xticks(rotation=45, ha='right')
            plot_count += 1
        
        if options["lastScore"] or options["firstScore"]:
            print("Creating score plot")
            ax = plt.subplot(rows, cols, plot_count)
            if options["lastScore"]:
                sns.lineplot(data=departments, x='label', y='lastScore', 
                           marker='o', color=colors[1], label='Son Yerleştirme Puanı')
            if options["firstScore"]:
                sns.lineplot(data=departments, x='label', y='firstScore', 
                           marker='s', color=colors[2], label='İlk Yerleştirme Puanı')
            ax.set_title('Yerleştirme Puanları')
            ax.set_xlabel('')
            ax.set_ylabel('Puan')
            plt.xticks(rotation=45, ha='right')
            ax.legend()
            plot_count += 1
        
        if options["ranks"]:
            print("Creating ranks plot")
            ax = plt.subplot(rows, cols, plot_count)
            x = np.arange(len(departments))
            width = 0.35
            
            ax.bar(x - width/2, departments['lastRank'], width, 
                   label='Son Sıralama', color=colors[3])
            ax.bar(x + width/2, departments['firstRank'], width, 
                   label='İlk Sıralama', color=colors[4])
            
            ax.set_title('Sıralama Değişimi')
            ax.set_xlabel('')
            ax.set_ylabel('Sıralama')
            ax.set_xticks(x)
            ax.set_xticklabels(departments['label'], rotation=45, ha='right')
            ax.legend()
            plot_count += 1
        
        # Adjust layout to prevent label cutoff
        plt.tight_layout()
        
        # Convert plot to base64
        img_bytes = BytesIO()
        plt.savefig(img_bytes, format='png', bbox_inches='tight', dpi=300)
        img_str = base64.b64encode(img_bytes.getvalue()).decode()
        plt.close()
        
        print("Visualization created successfully")
        return {"image": img_str}
        
    except Exception as e:
        print("Error in create_visualization:", str(e))
        print("Traceback:", traceback.format_exc())
        raise

@app.post("/api/visualize")
async def visualize_departments(data: Dict):
    try:
        print("Received request data:", json.dumps(data, indent=2))
        result = create_visualization(data)
        if result is None:
            raise HTTPException(status_code=400, detail="En az bir görselleştirme seçeneği seçilmelidir")
        return result
    except Exception as e:
        print("Error in visualize_departments:", str(e))
        print("Traceback:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Görselleştirme oluşturulurken hata oluştu: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)