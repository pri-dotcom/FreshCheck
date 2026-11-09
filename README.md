# FreshCheck 🌿
> **AI-Based Detection of Unsafe Fruits and Vegetables**  
> *Know Your Food, Protect Your Health*  
> **A College Community Service Project (CSP)**  
> **Department of Computer Science and Engineering**

FreshCheck is a modern, responsive public health education and visual screening platform designed to create awareness about identifying visibly spoiled fruits and vegetables through their external appearance.

---

## 👥 Project Team & Academic Credentials

- **Project Title:** AI-Based Detection of Unsafe Fruits and Vegetables
- **Project Type:** College Community Service Project (CSP)
- **Department:** Department of Computer Science and Engineering
- **Project Guide:** Ms. Y. Geetha Sri, M.Tech.

### Project Team Members:
1. **Degala Priyanka**
2. **Buggala Sirisha**
3. **Choragudi Jubeda**
4. **Gullapudi Pavani**

---

## 🎯 Project Objectives

1. **Identify visible signs** of fruit and vegetable spoilage by observing their external appearance.
2. **Improve food-safety awareness** among students, families, and community members.
3. **Provide easy image-based visual screening** accessible on any smartphone or browser.
4. **Promote safer food-handling practices** to prevent avoidable household foodborne illnesses.
5. **Educate people** about identifying damaged, spoiled, and unwholesome produce.

---

## 🔬 Technical Methodology (Zero Heavy ML / Pure Browser Processing)

FreshCheck adheres strictly to client-side, zero-cost web standards:
- **No CNN / Deep Learning**: No heavy convolutional neural networks or trained AI models.
- **No TensorFlow / PyTorch**: Zero heavy framework dependencies or installation overhead.
- **No Paid or Complex AI APIs**: Runs 100% in the user's browser using HTML5 Canvas 2D image processing.
- **Deterministic Color & Defect Analysis**:
  - Resizes images to standard dimensions on an offscreen HTML5 Canvas.
  - Converts RGB pixels to relative luminance ($Y = 0.299R + 0.587G + 0.114B$) and HSV/HSL color distributions.
  - Checks overall lighting validity (flags images that are too dark, overexposed, or uniform as "Unable to Determine").
  - Isolates produce from neutral backdrops via foreground segmentation.
  - Detects necrotic dark spots, browning oxidation, fungal mold spores (*Penicillium*, *Botrytis*), and green solanine accumulation in potatoes.
  - Generates an interactive **Defect Highlight Mask** on a secondary canvas for complete transparency.

---

## 🚦 Three Categorical Screening Outcomes

1. **APPEARS FRESH** (Green Indicator):
   - *Message:* *"No significant visible signs of spoilage were detected. The produce appears visually acceptable."*
   - Includes surface blemish ratio, color vibrancy score, and tailored storage recommendations.

2. **POSSIBLE SPOILAGE** (Orange/Red Indicator):
   - *Message:* *"Some unusual visible surface characteristics were detected. Please inspect the produce carefully."*
   - Details detected visual anomalies, dark spot coverage, and actionable safety handling advice.

3. **UNABLE TO DETERMINE** (Yellow Indicator):
   - *Message:* *"The image could not be assessed reliably. Please upload a clearer image with good lighting."*
   - Contextual advice on lighting, camera positioning, and retaking clear photos.

---

## 🍎 14 Covered Fruits & Vegetables

### Fruits (7):
1. **Apple** (Malus domestica)
2. **Banana** (Musa acuminata)
3. **Orange** (Citrus sinensis)
4. **Mango** (Mangifera indica)
5. **Grapes** (Vitis vinifera)
6. **Papaya** (Carica papaya)
7. **Guava** (Psidium guajava)

### Vegetables (7):
1. **Tomato** (Solanum lycopersicum)
2. **Potato** (Solanum tuberosum)
3. **Onion** (Allium cepa)
4. **Brinjal / Eggplant** (Solanum melongena)
5. **Carrot** (Daucus carota)
6. **Cabbage** (Brassica oleracea var. capitata)
7. **Cauliflower** (Brassica oleracea var. botrytis)

Each item includes an individual information card with healthy appearance traits, common spoilage signs, purchasing guidance, and an interactive **"View Detailed Guide"** modal.

---

## ⚠️ Important Public Food Safety Disclaimer

> **FreshCheck is an educational awareness and initial visual screening tool. It examines only the external appearance of fruits and vegetables. It cannot detect bacteria, viruses, pesticides, chemicals, toxins or other invisible contamination. A fruit or vegetable that appears fresh is not necessarily safe to consume. Always follow proper food hygiene, washing and storage practices. Do not depend solely on this tool to decide whether food is safe.**

---

## 🚀 How to Run the Website

### Option 1: Direct File Open
Simply double-click `index.html` in your file explorer to open it in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

### Option 2: Local HTTP Server (Recommended for Camera Access)
Modern web browsers require an `http://localhost` origin to grant device camera access. Run:
```bash
# Using Python:
python -m http.server 8000

# Using Node.js (npx):
npx serve .
```
Then navigate to `http://localhost:8000` in your browser.

---

## 📁 Repository Structure

```
FreshCheck/
├── index.html        # Complete semantic HTML5 structure (8 major sections + modal)
├── style.css         # Modern green, white & soft cream CSS3 design system
├── styles.css        # Import link to style.css for backward compatibility
├── script.js         # Canvas pixel processing, camera stream, database & modal logic
├── assets/           # Local project assets directory
└── README.md         # Community Service Project documentation
```

---

*“Small Checks. Safer Choices. Healthier Communities.”*
