// import Link from "next/link";

// export default function NotFound() {
//   return (
//     <div className="h-[100vh] w-full bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="h-full w-full rounded-2xl border bg-white shadow-sm flex items-center justify-center">
//         <div className="text-center max-w-md">
//           {/* 404 Heading */}
//           <div className="flex items-baseline justify-center gap-3 mb-4">
//             <h1 className="text-5xl font-semibold text-blue-600 tracking-tight">
//               404
//             </h1>
//             <span className="text-2xl font-semibold text-gray-700">
//               Page Not Found
//             </span>
//           </div>

//           {/* Description */}
//           <p className="text-gray-500 text-sm leading-relaxed mb-8">
//             The page you’re looking for doesn’t exist or may have been moved.
//             Please check the URL.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-[100vh] w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="h-full w-full rounded-2xl border bg-white shadow-sm flex items-center justify-center">
        <div className="text-center max-w-md">
          {/* 404 Heading */}
          <div className="flex items-baseline justify-center gap-3 mb-4">
            <h1 className="text-5xl font-semibold text-blue-600 tracking-tight">
              404
            </h1>
            <span className="text-2xl font-semibold text-gray-700">
              Page Not Found
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            The page you're looking for doesn't exist or may have been moved.
            Please check the URL.
          </p>

          {/* Button */}
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}