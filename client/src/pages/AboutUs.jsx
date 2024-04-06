import React from "react";

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4">За нас</h1>
      <div className="bg-gradient-to-r from-white to-gray-50 shadow-lg p-6 rounded-lg">
        <p className="text-lg text-gray-700 mb-4">
          Добре дошли в Cultural Mosaic, вашият надежден партньор в
          проследяването на филми, книги и телевизионни предавания. Ние сме
          посветени на предоставянето на актуална и точна информация, за да ви
          помогнем да останете в крак с последните тенденции и да откриете нови
          любими.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Основана през 2023, нашата мисия е да създадем общност за любителите
          на развлеченията, където всеки може да открие и сподели своите любими
          творби. С помощта на интуитивен интерфейс и обширна база данни,
          Cultural Mosaic предлага персонализирано изживяване за всеки свой
          потребител.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Ние вярваме в силата на споделената страст към филмите, книгите и
          телевизионните предавания и се стремим да бъдем мост между творците и
          аудиторията. Нашият екип е съставен от ентусиасти в областта на
          културата, технологиите и дизайна, всеки от които допринася с уникални
          умения и гледна точка към развитието на нашия проект.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Благодарим ви, че избрахте Cultural Mosaic. Надяваме се да ви
          предоставим не само полезна платформа, но и източник на вдъхновение и
          радост. За повече информация или при въпроси, моля не се колебайте да
          се свържете с нас.
        </p>
      </div>
      <div className="text-center mt-8">
        <h2 className="text-2xl font-semibold mb-2">Свържете се с нас</h2>
        <div className="bg-white shadow-md p-4 rounded-lg inline-block">
          <p className="text-lg text-gray-700 mb-1">
            Email: info@culturalmosaic.com
          </p>
          <p className="text-lg text-gray-700 mb-1">
            Телефон: +359 123 456 789
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
