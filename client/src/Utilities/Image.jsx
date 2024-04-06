export default function Image({ src, ...rest }) {
  // Assuming 'src' is the image source and 'rest' includes other props

  const imagePath =
    src && src.includes("http") ? src : `http://localhost:4000/uploads/${src}`;
  return <img src={imagePath} alt="" {...rest} />;
}
