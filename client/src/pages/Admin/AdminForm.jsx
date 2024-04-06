import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import axios from "axios";
import PhotosUploader from "../../Utilities/PhotosUploader";

export default function AdminForm() {
  const { id, subpage } = useParams();

  // Form state
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [genre, setGenre] = useState([]);
  const [runTime, setRunTime] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [seasons, setSeasons] = useState("");
  const [author, setAuthor] = useState("");
  const [page, setPage] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [errors, setErrors] = useState({});

  // Load data for editing
  useEffect(() => {
    if (id === "new") return;
    axios.get(`/${subpage}/${subpage}/` + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setDirector(data.director);
      setReleaseYear(data.releaseYear);
      setGenre(data.genre);
      setRunTime(data.runTime || "");
      setAddedPhotos(data.photos);
      setDescription(data.description);
      if (subpage === "shows") {
        setSeasons(data.seasons);
      } else if (subpage === "books") {
        setAuthor(data.author);
        setPage(data.page);
      }
    });
  }, [id, subpage]);

  // Validate individual fields
  const validateField = (name, value) => {
    let errorMsg = "";
    switch (name) {
      case "title":
        if (!value.trim()) errorMsg = "Заглавието е задължително.";
        break;
      case "director":
      case "author":
        if (!value.trim())
          errorMsg = `${
            subpage === "books" ? "Автор" : "Режисюор"
          } е задължително.`;
        break;
      case "releaseYear":
        if (!/^\d{4}$/.test(value)) errorMsg = "Моля въведете валидна година.";
        break;
      case "runTime":
      case "seasons":
      case "page":
        if (value && !/^\d+$/.test(value))
          errorMsg = "Трябва да е число по голямо от 0.";
        break;
      case "genre":
        if (!value.length) errorMsg = "Поне един жанр е нужен.";
        break;
      case "description":
        if (!value.trim()) errorMsg = "Нужно е описание.";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  // Check the entire form for validity
  const isFormValid = () => {
    const newErrors = {};

    // Validate all fields
    validateField("title", title);
    validateField(
      subpage === "books" ? "author" : "director",
      subpage === "books" ? author : director
    );
    validateField("releaseYear", releaseYear);
    validateField("genre", genre);
    validateField("description", description);

    if (subpage === "movies") validateField("runTime", runTime);
    if (subpage === "shows") validateField("seasons", seasons);
    if (subpage === "books") validateField("page", page);

    // Check for any errors
    const hasErrors = Object.keys(newErrors).length > 0;
    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!isFormValid()) {
      alert("Моля въведете досатърна информация, за да можете да запазите.");
      return;
    }

    const mediaData = {
      title,
      director,
      releaseYear,
      genre,
      runTime: subpage === "movies" ? runTime : null,
      addedPhotos,
      description,
      seasons: subpage === "shows" ? seasons : null,
      author: subpage === "books" ? author : null,
      page: subpage === "books" ? page : null,
    };

    try {
      if (id !== "new") {
        await axios.put(`/${subpage}/${subpage}`, { id, ...mediaData });
      } else {
        await axios.post(`/${subpage}/${subpage}`, mediaData);
      }
      setRedirect(true);
    } catch (error) {
      console.error("Error saving the media item:", error);
      alert("Имаше проблем при запазването.");
    }
  };

  const handleChange = (ev, fieldSetter, fieldName) => {
    const value =
      fieldName === "genre" ? ev.target.value.split(", ") : ev.target.value;
    fieldSetter(value);
    validateField(fieldName, value);
  };

  if (redirect) {
    return <Navigate to={`/admin/${subpage}`} />;
  }
  async function handleDelete(ev) {
    ev.preventDefault();
    if (window.confirm("Сигурни ли сте, че искате да изтриете този елемент?")) {
      try {
        await axios.delete(`/${subpage}/${subpage}/${id}`);
        setRedirect(true);
      } catch (error) {
        console.error("Error deleting media:", error);
      }
    }
  }

  return (
    <div className="bg-background p-5 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-contrastBg rounded-lg p-4 shadow-md"
      >
        {/* Title */}
        <div className="form-section">
          <label htmlFor="title" className="form-label">
            Заглавие
          </label>
          <input
            id="title"
            className={`form-input ${errors.title ? "border-red-500" : ""}`}
            type="text"
            placeholder="Заглавие"
            value={title}
            onChange={(ev) => handleChange(ev, setTitle, "title")}
          />
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>

        {/* Director/Author */}
        <div className="form-section">
          <label htmlFor="director-author" className="form-label">
            {subpage === "books" ? "Автор" : "Режисьор"}
          </label>
          <input
            id="director-author"
            className={`form-input ${
              errors.director || errors.author ? "border-red-500" : ""
            }`}
            type="text"
            placeholder={subpage === "books" ? "Автор" : "Режисьор"}
            value={subpage === "books" ? author : director}
            onChange={(ev) =>
              handleChange(
                ev,
                subpage === "books" ? setAuthor : setDirector,
                subpage === "books" ? "author" : "director"
              )
            }
          />
          {(errors.director || errors.author) && (
            <p className="text-red-500">{errors.director || errors.author}</p>
          )}
        </div>

        {/* Release Year */}
        <div className="form-section">
          <label htmlFor="releaseYear" className="form-label">
            Година на издаване
          </label>
          <input
            id="releaseYear"
            className={`form-input ${
              errors.releaseYear ? "border-red-500" : ""
            }`}
            type="text"
            placeholder="Година на издаване"
            value={releaseYear}
            onChange={(ev) => handleChange(ev, setReleaseYear, "releaseYear")}
          />
          {errors.releaseYear && (
            <p className="text-red-500">{errors.releaseYear}</p>
          )}
        </div>

        {/* Genre */}
        <div className="form-section">
          <label htmlFor="genre" className="form-label">
            Жанр
          </label>
          <input
            id="genre"
            className={`form-input ${errors.genre ? "border-red-500" : ""}`}
            type="text"
            placeholder="Жанр"
            value={genre.join(", ")}
            onChange={(ev) => handleChange(ev, setGenre, "genre")}
          />
          {errors.genre && <p className="text-red-500">{errors.genre}</p>}
        </div>

        {/* Runtime/Seasons/Pages */}
        <div className="form-section">
          <label htmlFor="runtime-seasons-pages" className="form-label">
            {subpage === "movies"
              ? "Продължителност"
              : subpage === "shows"
              ? "Сезони"
              : "Брой страници"}
          </label>
          <input
            id="runtime-seasons-pages"
            className={`form-input ${
              errors.runTime || errors.seasons || errors.page
                ? "border-red-500"
                : ""
            }`}
            type="text"
            placeholder={
              subpage === "movies"
                ? "Продължителност"
                : subpage === "shows"
                ? "Сезони"
                : "Брой страници"
            }
            value={
              subpage === "movies"
                ? runTime
                : subpage === "shows"
                ? seasons
                : page
            }
            onChange={(ev) =>
              handleChange(
                ev,
                subpage === "movies"
                  ? setRunTime
                  : subpage === "shows"
                  ? setSeasons
                  : setPage,
                subpage === "movies"
                  ? "runTime"
                  : subpage === "shows"
                  ? "seasons"
                  : "page"
              )
            }
          />
          {(errors.runTime || errors.seasons || errors.page) && (
            <p className="text-red-500">
              {errors.runTime || errors.seasons || errors.page}
            </p>
          )}
        </div>

        {/* Photos Uploader */}
        <div className="form-section">
          <label className="form-label">Снимки</label>
          <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        </div>

        {/* Description */}
        <div className="form-section">
          <label htmlFor="description" className="form-label">
            Описание
          </label>
          <textarea
            id="description"
            className={`form-textarea ${
              errors.description ? "border-red-500" : ""
            }`}
            value={description}
            onChange={(ev) => handleChange(ev, setDescription, "description")}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions mt-4 flex">
          <button
            type="submit"
            disabled={Object.keys(errors).some((key) => errors[key])}
            className={`mr-2 px-6 py-3 rounded-lg font-medium text-md transition-colors ${
              Object.keys(errors).some((key) => errors[key])
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            Запази
          </button>
          <Link
            to={`/admin/${subpage}`}
            className="px-6 py-3 mr-2 bg-blue hover:bg-contrastBlue text-white rounded-lg font-medium text-md transition-colors"
          >
            Отказ
          </Link>
          {id !== "new" && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-md transition-colors"
            >
              Изтрий
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
