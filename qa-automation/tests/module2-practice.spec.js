import { test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

const testEmails = [
  '',
  'user@example.com',
  'userexample.com',
  '',
  'user@', 
];

let checksPassed = 0;

test('тестові дані для перевірки логіну', async () => {
  console.log('До push:', testEmails, 'довжина:', testEmails.length);

  testEmails.push('another@example.com'); 

  console.log('Після push:', testEmails, 'довжина:', testEmails.length);
});

test('перевірка кількості знайдених рецептів', async () => {
const recipesFoundText = '7'; 
const recipesFound = Number(recipesFoundText);
if (recipesFound === 12){
  console.log(`Знайдено очікувану кількість: ${recipesFound}`);
}
else if (recipesFound === 0){
  console.log('Результатів не знайдено')
}
else {
  console.log(`Знайдено іншу кількість: ${recipesFound}`);
}
const recipeAuthor = null;
console.log(recipeAuthor || 'Автор невідомий');
});

test('перебір email через continue і break', async () => {
  for (const email of testEmails) {
    if (email === '') {
      console.log('Пропускаю порожнє значення');
      continue;
    }

    if (email === 'another@example.com') {
      console.log(`Знайдено ${email}, зупиняю цикл`);
      break;
    }

    checksPassed++;
    console.log(`Перевірено: ${email} (checksPassed = ${checksPassed})`);
  }

  console.log('Разом checksPassed:', checksPassed);
});

test('зменшення часу приготування через цикли', async () => {
  let cookingTime = 90;
  while (cookingTime >= 30) {
    cookingTime -= 10; 
    console.log(`while: ${cookingTime}`);
  }

  let cookingTime2 = 90;
  do {
    cookingTime2 -= 10;
    console.log(`do...while: ${cookingTime2}`);
  } while (cookingTime2 >= 30);
});

test('бонус: break на першому невалідному email', async () => {
  for (const email of testEmails) {
    if (email === '') continue;

    const isInvalid = !email.includes('@') || email.endsWith('@');
    if (isInvalid) {
      console.log(`Перший невалідний email: ${email}, зупиняю цикл`);
      break;
    }
    console.log(`Валідний на вигляд: ${email}`);
  }
});