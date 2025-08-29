export function Register() {
  return (
    <>
          <h1 className="text-2xl text-center my-5">Registrera dig</h1>
    <div className="flex justify-center">
      <form action="" className="w-full max-w-xl">
        <div className="my-5">
          <label htmlFor="">E-Post</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            required
            className="border border-gray-500 rounded px-3 py-1 mt-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="">Lösenord</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            required
            className="border border-gray-500 rounded px-3 py-1 mt-2 w-full"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="Registrera dig"
            className="bg-blue-500 text-white rounded px-4 py-2 my-5 hover:bg-blue-700 hover:cursor-pointer"
          >
            Registrera dig
          </button>
        </div>
      </form>
    </div>
    </>
  );
}
