const sections = [
  {
    key: "governance",
    title: "Governance",
    description: "Leadership alignment, decision-making clarity, and accountability.",
    questions: [
      "Leadership communicates a clear strategic direction.",
      "Decision rights and responsibilities are well defined.",
      "Performance is reviewed consistently with measurable KPIs."
    ],
    recommendations: [
      "Define and publish a governance charter with clear accountabilities.",
      "Introduce a monthly executive KPI review with decision tracking.",
      "Standardize policy communication to improve transparency across teams."
    ]
  },
  {
    key: "operations",
    title: "Operations",
    description: "Process efficiency, execution consistency, and risk control.",
    questions: [
      "Core workflows are documented and consistently followed.",
      "Operational issues are resolved quickly with root-cause analysis.",
      "Resources are planned effectively to meet demand fluctuations."
    ],
    recommendations: [
      "Map end-to-end processes and define standard operating procedures.",
      "Set operational SLAs and implement recurring process health checks.",
      "Create a capacity planning cadence tied to demand forecasting."
    ]
  },
  {
    key: "customerExperience",
    title: "Customer Experience",
    description: "Voice of customer, service quality, and journey optimization.",
    questions: [
      "Customer feedback is actively collected and acted upon.",
      "Service interactions are consistent across channels.",
      "Customer journey pain points are identified and improved regularly."
    ],
    recommendations: [
      "Build a closed-loop feedback process with ownership and timelines.",
      "Define channel service standards and monitor adherence weekly.",
      "Run quarterly customer journey reviews with cross-functional teams."
    ]
  },
  {
    key: "quality",
    title: "Quality",
    description: "Standards compliance, defect prevention, and continuous improvement.",
    questions: [
      "Quality standards are clearly defined and understood.",
      "Defects are tracked with preventive actions implemented.",
      "Continuous improvement initiatives are prioritized and measured."
    ],
    recommendations: [
      "Introduce a quality management framework with clear acceptance criteria.",
      "Implement recurring defect trend analysis and prevention plans.",
      "Create a visible improvement backlog and govern it monthly."
    ]
  },
  {
    key: "technology",
    title: "Technology",
    description: "System reliability, data capability, and digital enablement.",
    questions: [
      "Technology systems reliably support business operations.",
      "Data is accessible and trusted for decision-making.",
      "Automation and digital tools are used to improve productivity."
    ],
    recommendations: [
      "Establish a technology roadmap aligned to strategic outcomes.",
      "Improve data governance and reporting standards for decision quality.",
      "Prioritize automation opportunities with measurable ROI targets."
    ]
  }
];

const sectionsContainer = document.getElementById("sectionsContainer");
const calculateBtn = document.getElementById("calculateBtn");
const overallScoreEl = document.getElementById("overallScore");
const classificationEl = document.getElementById("classification");
const sectionScoresEl = document.getElementById("sectionScores");
const recommendationsEl = document.getElementById("recommendations");
const questionTemplate = document.getElementById("questionTemplate");

function renderAssessment() {
  sections.forEach((section) => {
    const sectionElement = document.createElement("section");
    sectionElement.className = "section-block";

    const title = document.createElement("h2");
    title.className = "section-title";
    title.textContent = section.title;

    const description = document.createElement("p");
    description.className = "section-description";
    description.textContent = section.description;

    sectionElement.append(title, description);

    section.questions.forEach((questionText, questionIndex) => {
      const templateContent = questionTemplate.content.cloneNode(true);
      const questionBlock = templateContent.querySelector(".question-block");
      const legend = templateContent.querySelector("legend");
      const scaleOptions = templateContent.querySelector(".scale-options");

      legend.textContent = `${questionIndex + 1}. ${questionText}`;
      questionBlock.name = `${section.key}-${questionIndex}`;

      for (let rating = 1; rating <= 5; rating += 1) {
        const id = `${section.key}-${questionIndex}-${rating}`;
        const label = document.createElement("label");
        label.setAttribute("for", id);

        const input = document.createElement("input");
        input.type = "radio";
        input.id = id;
        input.name = `${section.key}-${questionIndex}`;
        input.value = rating;

        label.append(input, document.createTextNode(`${rating}`));
        scaleOptions.appendChild(label);
      }

      sectionElement.appendChild(templateContent);
    });

    sectionsContainer.appendChild(sectionElement);
  });
}

function getClassification(score) {
  if (score < 2.5) {
    return { label: "Emerging", className: "emerging" };
  }
  if (score < 3.75) {
    return { label: "Developing", className: "developing" };
  }
  return { label: "Mature", className: "mature" };
}

function calculateResults() {
  const sectionScores = [];
  const generatedRecommendations = [];

  sections.forEach((section) => {
    let sectionTotal = 0;
    let answeredCount = 0;

    section.questions.forEach((_, questionIndex) => {
      const selected = document.querySelector(
        `input[name="${section.key}-${questionIndex}"]:checked`
      );
      if (selected) {
        sectionTotal += Number(selected.value);
        answeredCount += 1;
      }
    });

    const sectionScore = answeredCount ? sectionTotal / section.questions.length : 0;
    sectionScores.push({ title: section.title, score: sectionScore });

    if (sectionScore > 0 && sectionScore < 3) {
      generatedRecommendations.push(...section.recommendations);
    }
  });

  const overallScore =
    sectionScores.reduce((sum, current) => sum + current.score, 0) / sectionScores.length;

  overallScoreEl.textContent = `${overallScore.toFixed(1)} / 5`;

  const classification = getClassification(overallScore);
  classificationEl.textContent = classification.label;
  classificationEl.className = `classification ${classification.className}`;

  sectionScoresEl.innerHTML = "";
  sectionScores.forEach((entry) => {
    const item = document.createElement("li");
    item.innerHTML = `${entry.title} <strong>${entry.score.toFixed(1)} / 5</strong>`;
    sectionScoresEl.appendChild(item);
  });

  recommendationsEl.innerHTML = "";
  if (!generatedRecommendations.length) {
    const item = document.createElement("li");
    item.textContent =
      "Great work. No critical low-score areas were identified. Focus on sustaining continuous improvement practices.";
    recommendationsEl.appendChild(item);
    return;
  }

  [...new Set(generatedRecommendations)].forEach((recommendation) => {
    const item = document.createElement("li");
    item.textContent = recommendation;
    recommendationsEl.appendChild(item);
  });
}

calculateBtn.addEventListener("click", calculateResults);
renderAssessment();
