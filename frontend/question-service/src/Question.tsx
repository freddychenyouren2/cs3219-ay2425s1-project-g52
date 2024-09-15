/**
 * Interface for Question objects
 */
interface Question {
  qId: number;
  qTitle: string;
  qDescription: string;
  qCategory: string[];
  qComplexity: string;
}

export default Question;
