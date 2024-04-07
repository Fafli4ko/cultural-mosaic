import { useState } from "react";
import axios from "axios";
import Image from "./Image";
import { TrashIcon, UploadIcon, StarIcon, FilledStarIcon } from "../Icons"; // Importing necessary icons

export default function PhotosUploader({ addedPhotos, onChange }) {
  const [photoLink, setPhotoLink] = useState("");

  async function addPhotoByLink(ev) {
    ev.preventDefault();
    try {
      const { data: filename } = await axios.post(
        "/photoUploader/upload-by-link",
        {
          link: photoLink,
        }
      );
      onChange((prev) => [...prev, filename]);
      setPhotoLink("");
    } catch (e) {
      console.log(e);
    }
  }

  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("/photoUploader/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        onChange((prev) => [...prev, ...filenames]);
      });
  }

  function removePhoto(ev, filename) {
    ev.preventDefault();
    onChange([...addedPhotos.filter((photo) => photo !== filename)]);
  }

  function selectMainPhoto(ev, filename) {
    ev.preventDefault();
    onChange([filename, ...addedPhotos.filter((photo) => photo !== filename)]);
  }

  return (
    <>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Добави чрез линк ... .jpg"
          value={photoLink}
          onChange={(ev) => setPhotoLink(ev.target.value)}
          className="bg-gray-200 px-4 text-black rounded-2xl"
        />
        <button
          onClick={addPhotoByLink}
          className="bg-gray-200 px-4 text-black rounded-2xl"
        >
          Добави линка
        </button>
        <label className="h-10 mt-5 cursor-pointer flex justify-center bg-orange hover:bg-selectOrange p-2 rounded-full text-white text-2xl text-gray-500 w-20">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={uploadPhoto}
          />
          <UploadIcon className="bg-red-600" />
        </label>
      </div>
      <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {addedPhotos.length > 0 &&
          addedPhotos.map((link, index) => (
            <div
              className={`h-full flex relative ${
                index === 0 ? "border-4 border-orange shadow-lg" : ""
              }`}
              key={link}
            >
              {index === 0 && (
                <div className="absolute top-1 left-1 text-orange">
                  <FilledStarIcon />
                </div>
              )}
              <Image
                className="rounded-2xl object-cover"
                src={link}
                alt="Uploaded photo"
                style={{ width: "100%", height: "100%" }}
              />
              <button
                onClick={(ev) => removePhoto(ev, link)}
                className="cursor-pointer absolute bottom-1 right-2 text-white bg-black bg-opacity-50 hover:bg-opacity-80 rounded-xl p-1"
              >
                <TrashIcon />
              </button>
              <button
                onClick={(ev) => selectMainPhoto(ev, link)}
                className="cursor-pointer absolute bottom-1 left-2 text-white bg-black bg-opacity-50 rounded-xl p-1"
              >
                {link === addedPhotos[0] ? <StarIcon /> : <StarIcon />}
              </button>
            </div>
          ))}
      </div>
    </>
  );
}
