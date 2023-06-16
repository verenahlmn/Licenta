import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const { error } = router.query
  return (
    <div
      className={
        'flex flex-col items-center content-center place-content-center w-screen h-screen bg-gray-200'
      }
    >
      <div className="bg-white rounded-lg flex flex-col py-4 px-8 drop-shadow-md">
        <div className="my-6 flex flex-col items-center">
          <h1 className="text-2xl font-bold">Login</h1>
        </div>
        {error && (
          <p className={'text-red-500 font-medium text-center'}>{error}</p>
        )}
        <form
          className={'flex-col flex w-80'}
          method="post"
          action="/api/login"
        >
          <div className="w-full relative group my-6">
            <input
              name="username"
              type="text"
              required
              className="w-full h-10 px-4 text-sm peer border-1 border-gray-300 bg-gray-100 outline-none rounded"
            />
            <label
              htmlFor={'username'}
              className="transform transition-all text-gray-400 absolute top-0 left-0 h-full flex items-center pl-2 text-sm group-focus-within:text-xs peer-valid:text-xs group-focus-within:h-1/2 peer-valid:h-1/2 group-focus-within:-translate-y-full peer-valid:-translate-y-full group-focus-within:pl-0 peer-valid:pl-0"
            >
              Username
            </label>
          </div>
          <div className="w-full relative group mb-6">
            <input
              name="password"
              type="password"
              required
              className="w-full h-10 px-4 text-sm peer border-1 border-gray-300 bg-gray-100 outline-none rounded"
            />
            <label
              htmlFor={'password'}
              className="transform transition-all text-gray-400 absolute top-0 left-0 h-full flex items-center pl-2 text-sm group-focus-within:text-xs peer-valid:text-xs group-focus-within:h-1/2 peer-valid:h-1/2 group-focus-within:-translate-y-full peer-valid:-translate-y-full group-focus-within:pl-0 peer-valid:pl-0"
            >
              Password
            </label>
          </div>
          <button
            type="submit"
            className="rounded bg-black text-white text-center p-3 font-medium"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  return {
    props: {},
  }
}
