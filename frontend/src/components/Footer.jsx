const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-200 py-3">
      <div className="container mx-auto text-center">
        <p className="text-gray-600">ProShop &copy; {currentYear}</p>
      </div>
    </footer>
  );
};

export default Footer;
