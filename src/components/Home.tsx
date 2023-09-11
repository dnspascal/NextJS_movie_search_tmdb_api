"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Loading from "./Loading";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Genres from "./Genres";
import { BsPlayFill } from "react-icons/bs";
// import ReactPlayer from "react-player";
import { IoMdClose } from "react-icons/io";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player/lazy"));

const Home = () => {
  interface IMovie {
    poster_path: string;
    title: string;
    genres: [{ name: string; id: string }];
    original_language: string;
    release_date: string;
    runtime: string;
    vote_average: string;
    overview: string;
    videos: {
      results: [
        {
          type: string;
          key: string;
        }
      ];
    };
  }
  const searchParams = useSearchParams();
  const [trailer, setTrailer] = useState("");
  const [movie, setMovie] = useState<IMovie>();

  useEffect(() => {
    setIsLoading(true);
    setIsImgLoading(true);

    let searchMovie = searchParams.get("movie");
    if (searchMovie === null) {
      searchMovie = "avengers";
    }
    axios
      .get(`http://api.themoviedb.org/3/search/movie`, {
        params: {
          //   api_key:process.env.locale .NEXT_PUBLIC_API_KEY
          api_key: "b281e83ebe3275288ec520cfe5a79b94",
          query: searchMovie,
        },
      })
      .then((res) => {
        const api1 = "b281e83ebe3275288ec520cfe5a79b94";
        axios
          .get(
            `https://api.themoviedb.org/3/movie/${res?.data?.results[0]?.id}?api_key=${api1}&append_to_response=videos`
          )
          .then((res2) => {
            console.log(res2, "datas");
            setMovie(res2.data);
          });
      })
      .catch((err) => console.log(err, "errors"));
  }, [searchParams]);

  useEffect(() => {
    const trailerIndex = movie?.videos?.results?.findIndex(
      (element) => element.type === "Trailer"
    );
    const trailerURL = `https://www.youtube.com/watch?v=${movie?.videos?.results[trailerIndex || 0]?.key
      }`;
    setTrailer(trailerURL);
  }, [movie]);

  const [showPlayer, setShowPlayer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(false);
  const posterPath = "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg";
  return (
    <div className="bg-secondary relative px-4 md:px-0 ">
      {/* {isLoading && <Loading />} */}
      <div className="container mx-auto min-h-[calc(100vh-77px)] flex items-center relative">
        <div className="flex-col lg:flex-row flex gap-10 lg:mx-10 py-20">
          <div className="mx-auto flex-none relative ">
            <Image
              src={`https://image.tmdb.org/t/p/w500/${movie?.poster_path}`}
              width={1000}
              height={700}
              className="w-[300px] object-cover "
              alt="movie poster"
              onLoadingComplete={() => setIsImgLoading(false)}
              priority
            />
            {isImgLoading && <Loading />}
          </div>
          <div className="space-y-6">
            <div className="uppercase -translate-3 text-[26px] md:text-[34px] font-medium pr-4 text-white">
              {movie?.title}
            </div>
            <div className="flex gsp-4 flex-wrap">
              {movie?.genres?.map((genre, index) => (
                <Genres
                  key={genre?.id}
                  index={index}
                  length={movie?.genres?.length}
                  name={genre?.name}
                />
              ))}
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-6">
              <div>Language: {movie?.original_language?.toUpperCase()}</div>
              <div>Release: {movie?.release_date} </div>
              <div>Runtime:{movie?.runtime}</div>
              <div>Rating:{movie?.vote_average}</div>
            </div>
            <div className="pt-14 space-y-2 pr-4">
              <div>OVERVIEW</div>
              <div className="lg:line-clamp-4">{movie?.overview}</div>
            </div>
            <div
              className="inline-block pt-6 cursor-pointer"
              onClick={() => setShowPlayer(true)}
            >
              <div className="flex gap-2 items-center bg-white text-textColor p-3 rounded  mb-6 hover:bg-[#b4b4b4]">
                <BsPlayFill size={24} />
                Watch Trailer
              </div>
            </div>
          </div>
        </div>
        {/* //Raact player */}
        <div
          className={` absolute top-3 inset-x-[7%] md:inset-x-[13%] rounded overflow-hidden transition duration-1000 ${showPlayer ? "opacity-100 z-50" : "opacity-0 -z-10"
            }`}
        >
          <div className="flex justify-between bg-black text-[#f9f9f9] p-3.5 items-center ">
            <span className="font-semibold">Playing Trailer</span>
            <div
              className=" cursor-pointer w-8 h-8 flex justify-center items-center  rounded-lg opacity-50 hover:opacity-75 hover:bg-[#0F0F0F]"
              onClick={() => setShowPlayer(false)}
            >
              <IoMdClose className={"h-5"} />
            </div>
          </div>
          <div className="relative pt-[56.25%]">
            <ReactPlayer
              url={trailer}
              width={"100%"}
              height="100%"
              style={{ position: "absolute", top: "0", left: "0" }}
              controls={true}
              playing={showPlayer}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

