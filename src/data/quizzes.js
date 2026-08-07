import reactImg from "../assets/quizzes/react.png";
import javaImg from "../assets/quizzes/nodejs.png";
import mernImg from "../assets/quizzes/mern.png";
import aptitudeImg from "../assets/quizzes/aptitude.png";

const quizzes = [
  {
    id: "react",
    title: "React Quiz",
    category: "React",
    difficulty: "Medium",
    questions: 10,
    time: 60,
    image: reactImg,
  },
  {
    id: "java",
    title: "Java Quiz",
    category: "Java",
    difficulty: "Medium",
    questions: 10,
    time: 60,
    image: javaImg,
  },
  {
    id: "mern",
    title: "MERN Quiz",
    category: "MERN",
    difficulty: "Medium",
    questions: 10,
    time: 60,
    image: mernImg,
  },
  {
    id: "aptitude",
    title: "Aptitude Quiz",
    category: "Aptitude",
    difficulty: "Medium",
    questions: 10,
    time: 60,
    image: aptitudeImg,
  },
];

export default quizzes;