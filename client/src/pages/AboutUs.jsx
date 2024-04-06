import React from "react";

const AboutUs = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-background">
      <h1 className="text-3xl font-bold text-center mb-4 text-primary">
        За нас
      </h1>
      <div className="bg-contrastBg shadow-lg p-6 rounded-lg">
        <p className="text-lg mb-4 leading-relaxed">
          Добре дошли в{" "}
          <span className="font-semibold text-primary">Cultural Mosaic</span>,
          вашият надежден партньор в проследяването на филми, книги и
          телевизионни предавания. Ние сме посветени на предоставянето на
          актуална и точна информация, за да ви помогнем да останете в крак с
          последните тенденции и да откриете нови любими.
        </p>
        <p className="text-lg mb-4 leading-relaxed">
          Основана през 2023, нашата мисия е да създадем общност за любителите
          на развлеченията, където всеки може да открие и сподели своите любими
          творби. С помощта на интуитивен интерфейс и обширна база данни,
          Cultural Mosaic предлага персонализирано изживяване за всеки свой
          потребител.
        </p>
        <p className="text-lg mb-4 leading-relaxed">
          Ние вярваме в силата на споделената страст към филмите, книгите и
          телевизионните предавания и се стремим да бъдем мост между творците и
          аудиторията. Нашият екип е съставен от ентусиасти в областта на
          културата, технологиите и дизайна, всеки от които допринася с уникални
          умения и гледна точка към развитието на нашия проект.
        </p>
        <p className="text-lg mb-6 leading-relaxed">
          Благодарим ви, че избрахте Cultural Mosaic. Надяваме се да ви
          предоставим не само полезна платформа, но и източник на вдъхновение и
          радост. За повече информация или при въпроси, моля не се колебайте да
          се свържете с нас.
        </p>
      </div>
      <div className="text-center mt-8">
        <h2 className="text-2xl font-semibold mb-2 text-primary">
          Свържете се с нас
        </h2>
        <div className="bg-white shadow-md p-4 rounded-lg inline-block">
          <p className="text-lg mb-1">
            Email:{" "}
            <a
              href="mailto:info@culturalmosaic.com"
              className="text-orange underline"
            >
              info@culturalmosaic.com
            </a>
          </p>
          <p className="text-lg mb-1">
            Телефон:{" "}
            <a href="tel:+359123456789" className="text-orange underline">
              +359 123 456 789
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
