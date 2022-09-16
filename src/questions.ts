import type { QuestionCollection } from 'inquirer';

const categories = ['react', 'design'];

const questions: QuestionCollection = [
  {
    type: 'input',
    name: 'Title',
    message: 'Please input your title',
  },
];

export default questions;
