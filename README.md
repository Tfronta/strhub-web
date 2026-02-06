# STRhub

**STRhub** is an open, web-based **educational and exploratory platform** for forensic Short Tandem Repeat (STR) genetics.

**Link to the platform:** https://www.strhub.app/

It is designed to make key forensic genetics concepts **transparent, visual, and accessible**, without requiring laboratory infrastructure, proprietary software, or black-box pipelines.

STRhub bridges the gap between **theory, interpretation, and intuition** by allowing users to explore how STR data behave under different forensic scenarios, including allele structure, population frequencies, mixture proportions, degradation, and conceptual links between capillary electrophoresis (CE) and next-generation sequencing (NGS)–based data.

STRhub is **not** a casework tool and does **not** replace validated forensic software.  
It is a **conceptual, educational, and research-support platform** focused on understanding, interpretability, and transparency.

## Intended Scope

STRhub is intended for:
- Education and training in forensic genetics  
- Academic courses, workshops, and demonstrations  
- Conceptual exploration of STR behavior and interpretation  
- Research support, discussion, and hypothesis visualization  

STRhub is **not intended for**:
- Forensic casework  
- Legal or evidentiary reporting  
- Automated genotype calling or operational interpretation  

## What You Can Explore

- **STR structure**
  - Core repeats and flanking regions  
  - Sequence-level variation and isoalleles  

- **CE-based signal behavior**
  - CE-like peak representations  
  - Relative signal contribution without laboratory assumptions  

- **Conceptual CE to NGS bridge**
  - NGS-like coverage representations derived from relative signal contribution  
  - No physical equivalence assumed between RFU values and read counts  

- **Mixture behavior (educational)**
  - Contributor proportions  
  - Allele sharing and balance  
  - Interpretation challenges in mixed profiles  

- **Population frequency data**
  - Exploration of allele frequency distributions  
  - Comparative views across loci and populations
    
## Data Sources and Transparency

All descriptive catalog information and population frequency data used in STRhub are derived **exclusively from established and publicly available resources**, including:
- STRidER  
- STRBase  
- ISFG recommendations  
- Other open STR datasets  

All sources are harmonized through an internal standardization workflow to ensure consistency in marker naming, allele designation, and metadata representation.

## Evaluation Philosophy

STRhub does **not** follow a classical operational validation framework.

Evaluation focuses on:
- Internal consistency of the models  
- Conceptual accuracy relative to forensic genetics principles  
- Coherence with published forensic descriptions  
- Manual verification of allele annotations against reference resources  
- Qualitative feedback from forensic practitioners and advanced students  

The platform prioritizes **explainability over performance metrics**.

## About This Repository

This repository contains the **source code that powers the STRhub web platform**.

While the code is openly available, STRhub is **not designed as a developer SDK**.  
Contributions, issues, and discussions are welcome, provided they align with the platform’s **educational, transparency-first philosophy**.

## Citation

If you use STRhub for teaching, academic discussion, or research contexts, please cite:

> Frontanilla T. et al.  
> **STRhub: an open platform for transparent exploration of forensic STR genetics**  
> Manuscript under review

(Citation details will be updated upon publication.)

## Disclaimer

STRhub is provided **for educational and research purposes only**.  
It must not be used for forensic casework, legal reporting, or evidentiary interpretation.

## License

This project is released under an open-source license.  
See the `LICENSE` file for details.
