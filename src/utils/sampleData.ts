
import { Question, Answer } from "@/types/qa";
import { v4 as uuidv4 } from "uuid";

/**
 * Generate sample questions for testing and initial setup
 * @param authorId The ID of the author to use
 * @param authorName The name of the author to use
 * @returns Array of sample questions
 */
export const generateSampleQuestions = (authorId: string, authorName: string): Question[] => {
  const now = new Date();
  
  return [
    {
      id: uuidv4(),
      title: "Hvernig verður norðurljós til?",
      content: "Ég hef oft séð myndir af norðurljósum á Íslandi og finnst þau mjög falleg. En hvernig verða þau til? Hver er vísindalega skýringin á þessu undri?",
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      authorId,
      authorName,
      upvotes: 15,
      category: "space",
      imageUrl: "https://images.unsplash.com/photo-1483086431886-3590a88317fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      source: "visindavefur.is"
    },
    {
      id: uuidv4(),
      title: "Hvaða dýr getur sofið með annað augað opið?",
      content: "Ég heyrði að sum dýr geti sofið með annað augað opið. Er það satt? Og ef svo er, hvaða dýr geta gert það og af hverju?",
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      authorId,
      authorName,
      upvotes: 8,
      category: "animals",
      imageUrl: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: uuidv4(),
      title: "Af hverju eru tómatar flokkaðir sem ávextir en ekki grænmeti?",
      content: "Ég hef alltaf haldið að tómatar væru grænmeti, en mér var sagt að þeir séu ávextir frá líffræðilegu sjónarhorni. Er það rétt og af hverju?",
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      authorId,
      authorName,
      upvotes: 12,
      category: "food",
      imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      source: "wikipedia.org"
    },
    {
      id: uuidv4(),
      title: "Hvernig virkar hljóðnemi?",
      content: "Ég er forvitinn um tæknina á bak við hljóðnema. Hvernig breytir hljóðnemi hljóðbylgjum í rafræn merki? Og eru til mismunandi gerðir af hljóðnemum?",
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      authorId,
      authorName,
      upvotes: 5,
      category: "science",
      imageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: uuidv4(),
      title: "Hver fann upp reiknivélina?",
      content: "Hver fann upp fyrstu reiknivélina og hvenær var það? Hvernig virkaði hún og hvernig leit hún út? Hvernig þróaðist hún í nútíma vasareiknivélar sem við þekkjum í dag?",
      createdAt: new Date().toISOString(), // Today
      authorId,
      authorName,
      upvotes: 3,
      category: "history",
      imageUrl: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isEasterEgg: true
    }
  ];
};

/**
 * Generate sample answers for the sample questions
 * @param authorId The ID of the author to use
 * @param authorName The name of the author to use
 * @param questions The questions to generate answers for
 * @returns Array of sample answers
 */
export const generateSampleAnswers = (
  authorId: string, 
  authorName: string, 
  questions: Question[]
): Answer[] => {
  const now = new Date();
  const answers: Answer[] = [];

  // Add answers for the first question (Northern Lights)
  if (questions.length > 0) {
    answers.push({
      id: uuidv4(),
      questionId: questions[0].id,
      content: "Norðurljós verða til þegar rafeindir og önnur orkuhlaðin efnisögn frá sólinni rekast á lofttegundir í efstu lögum lofthjúps jarðar. Þessar árekstrar valda því að gasagnirnar gefa frá sér ljós. Litir norðurljósanna fara eftir því hvaða lofttegundir koma við sögu - súrefni gefur grænt og rautt ljós, en nitur gefur blátt ljós. Norðurljósin sjást best nálægt segulpólunum, því þar stýrir segulsvið jarðar orkuhlaðnu ögnunum í lofthjúpinn.",
      createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
      authorId,
      authorName,
      upvotes: 7
    });
  }

  // Add answers for the second question (Animals sleeping with one eye open)
  if (questions.length > 1) {
    answers.push({
      id: uuidv4(),
      questionId: questions[1].id,
      content: "Já, þetta er rétt! Sum dýr geta sofið með annað augað opið og hálfa heilann vakandi. Þetta kallast „einhvelfasofandi" (e. unihemispheric slow-wave sleep). Þetta á sérstaklega við um sjávardýr eins og höfrunga og hvali, sem þurfa að halda áfram að anda meðan þau sofa. Einnig geta sum fugladýr, eins og endur, gert þetta þegar þær sofa í hópi til að fylgjast með rándýrum. Þetta gerir dýrunum kleift að hvíla sig en á sama tíma vera vakandi fyrir hættum eða til að framkvæma nauðsynlega líkamsstarfsemi.",
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      authorId,
      authorName,
      upvotes: 12
    });
  }

  // Add answers for the third question (Tomatoes)
  if (questions.length > 2) {
    answers.push({
      id: uuidv4(),
      questionId: questions[2].id,
      content: "Tómatar eru í raun og veru ávextir frá líffræðilegu sjónarmiði, en eru oft flokkaðir sem grænmeti í matargerð. Í líffræði er ávöxtur skilgreindur sem þroska frjóvguð eggja blómplantna sem inniheldur fræ. Tómatar þróast úr blóminu á plöntunni og innihalda fræ, þannig að þeir uppfylla líffræðilegu skilyrðin fyrir ávöxt. Hins vegar, árið 1893 úrskurðaði Hæstiréttur Bandaríkjanna að tómatar skyldu flokkaðir sem grænmeti vegna tollalaga, því þeir eru notaðir í matargerð sem grænmeti.",
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      authorId,
      authorName,
      upvotes: 8
    });
  }

  return answers;
};

/**
 * Add sample data to the application
 * @param addQuestionFn Function to add a question
 * @param addAnswerFn Function to add an answer
 * @param userId The ID of the current user
 * @param userName The name of the current user
 */
export const populateSampleData = (
  addQuestionFn: (
    title: string,
    content: string,
    article?: string,
    attachment?: {
      type: 'file' | 'video' | 'link';
      url: string;
      name?: string;
    } | null,
    source?: string,
    imageUrl?: string,
    category?: string
  ) => void,
  addAnswerFn: (questionId: string, content: string) => void,
  userId: string,
  userName: string
) => {
  const sampleQuestions = generateSampleQuestions(userId, userName);
  
  sampleQuestions.forEach(question => {
    addQuestionFn(
      question.title,
      question.content,
      undefined,
      null,
      question.source,
      question.imageUrl,
      question.category
    );
  });
  
  setTimeout(() => {
    // Get the latest questions
    const storedQuestions = JSON.parse(localStorage.getItem('qa-questions') || '[]');
    
    if (storedQuestions.length >= 3) {
      // Add some sample answers to the first 3 questions
      addAnswerFn(
        storedQuestions[0].id,
        "Norðurljós verða til þegar rafeindir og önnur orkuhlaðin efnisögn frá sólinni rekast á lofttegundir í efstu lögum lofthjúps jarðar. Þessar árekstrar valda því að gasagnirnar gefa frá sér ljós. Litir norðurljósanna fara eftir því hvaða lofttegundir koma við sögu - súrefni gefur grænt og rautt ljós, en nitur gefur blátt ljós."
      );
      
      addAnswerFn(
        storedQuestions[1].id,
        "Já, þetta er rétt! Sum dýr geta sofið með annað augað opið og hálfa heilann vakandi. Þetta kallast „einhvelfasofandi" (e. unihemispheric slow-wave sleep). Þetta á sérstaklega við um sjávardýr eins og höfrunga og hvali, sem þurfa að halda áfram að anda meðan þau sofa."
      );
      
      addAnswerFn(
        storedQuestions[2].id,
        "Tómatar eru í raun og veru ávextir frá líffræðilegu sjónarmiði, en eru oft flokkaðir sem grænmeti í matargerð. Í líffræði er ávöxtur skilgreindur sem þroska frjóvguð eggja blómplantna sem inniheldur fræ."
      );
    }
  }, 500);
};
