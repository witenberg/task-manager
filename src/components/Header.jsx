const Header = ({ title, description }) => {
    return (
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-700">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </header>
    );
  };
  
  export default Header;
  