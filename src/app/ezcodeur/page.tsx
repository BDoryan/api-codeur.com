'use client'

import SelectBox from '@/components/SelectBox';
import { useEffect, useState } from 'react';

export default function Home() {


  function slugify(text: string) {
    text = text.toLowerCase();
    text = text.normalize('NFKD').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase();

    text = text.replace(/[^\w\s-]/g, '');
    text = text.replace(/\s+/g, '-');

    return text;
  }

  const [remember_user_token, setRememberUserToken] = useState(localStorage.getItem("remember_user_token") ?? "");

  const [logged, setLogged] = useState<boolean | undefined>(undefined);
  const [loginSubmitting, setLoginSubmitting] = useState<boolean | undefined>(false);

  const [projects, setProjects] = useState<any[] | undefined>([]);

  useEffect(() => {
    localStorage.setItem('remember_user_token', remember_user_token);
  }, [remember_user_token])


  const [userData, setUserData] = useState<any | undefined>();

  const login = async () => {
    setLoginSubmitting(true)
    const response = await fetch('http://localhost:3000/api/1.0/login?remember_user_token=' + remember_user_token);
    const data = await response.json();

    setLoginSubmitting(false);

    const logged = data.logged != undefined && data.logged;
    setLogged(logged);
    if (logged)
      setUserData(data.data);
  }

  const [category, setCategory] = useState<any | undefined>();
  const [section, setSection] = useState<string | undefined>();

  const fetchProjects = async () => {
    setProjects(undefined)
    const response = await fetch('http://localhost:3000/api/1.0/projects?remember_user_token=' + remember_user_token + "&category=" + (category != undefined ? category.slug : "") + "&section=" + (section != undefined ? slugify(section) : ""));
    const data = await response.json();


    setProjects(data.projects != undefined ? data.projects : []);
  }

  const { categories } = require("@/codeur/codeur");
  const categoriesList = Object.values(categories).map((category: any) => { return { ...category, name: category.name } });

  const [project, setProject] = useState<any>(undefined);

  const Project = (props: { project: any }) => {

    const project = props.project;

    /*
    return (
      <a href={project.url} target={"_blank"} className="hover:shadow-md transition delay-0 duration-150 ease-in-out mt-5 flex flex-col justify-center px-6 py-6 lg:px-8 border rounded-md">
        <h1 className="text-lg uppercase font-semibold">{project.title}</h1>
        <div className="flex">
          <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">{project.status}</span>
          <span className="bg-gray-100  text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">{project.budget}</span>
          <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">{project.numOffers} offres</span>
          <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">{project.views} vues</span>
          {project.givedOffer && (
            <span className="bg-green-100 text-white-100 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Offre déposée</span>
          )}
        </div>
        <p className="text-md mt-3">{project.summary}</p>

      </a>
    )*/

    return (
      <a onClick={(e) => setProject(project)} href="#offer" className="hover:shadow-md transition delay-0 duration-150 ease-in-out mt-5 flex flex-col justify-center px-6 py-6 lg:px-8 border rounded-md">
        <h1 className="text-lg uppercase font-semibold">{project.title}</h1>
        <div className="flex">
          <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">{project.status}</span>
          <span className="bg-gray-100  text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">{project.budget}</span>
          <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">{project.numOffers} offres</span>
          <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">{project.views} vues</span>
          {project.givedOffer && (
            <span className="bg-green-100 text-white-100 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Offre déposée</span>
          )}
        </div>
        <p className="text-md mt-3">{project.summary}</p>

      </a>
    )
  }

  return (
    <div className="App py-12">
      <main className="mx-auto py-5 w-full px-5 lg:w-1/2">
        <h1 className="uppercase text-5xl pt-5 pb-2 font-extrabold">Bienvenue sur <span className="text-indigo-600 normal">EzCodeur</span></h1>
        <p className="text-md pt-4">Découvrez notre plateforme innovante pour la prospection simplifiée ! Vous êtes un jeune développeur à la recherche d'opportunités ? Nous comprenons que la prospection peut être chronophage, et les forfaits automatisés peuvent être coûteux. C'est pourquoi nous avons créé un micro-service basé sur le scraping pour vous aider.</p>
        <p className="text-md pt-4">Notre solution vous permet de automatiser la prospection en proposant des offres en temps réel. Grâce à l'intégration de l'intelligence artificielle, vous pouvez même rédiger des réponses personnalisées pour chaque projet. Ne perdez plus de temps à chercher manuellement des opportunités, laissez notre plateforme optimiser les offres pour des projets pertinents.</p>
        <p className="text-md pt-4">Nous améliorons également l'expérience utilisateur pour des recherches plus efficaces. Fini les projets peu concrets, notre système filtre les opportunités pour vous offrir des résultats de qualité. De plus, nos offres sont flexibles et personnalisables, vous pouvez les ajuster selon vos besoins.</p>
        <p className="text-md pt-4">Toutes ces fonctionnalités sont inspirées de ce que propose <a className="text-indigo-600 font-semibold hover:underline" href="https://www.codeur.com/">codeur.com</a>, mais à un coût bien plus abordable. Rejoignez-nous pour une prospection simplifiée et efficace, conçue spécialement pour les jeunes développeurs comme vous.</p>
      </main>
      <section className="mx-auto py-5 w-full px-5 lg:w-1/2">
        <h2 className="uppercase text-3xl pt-5 pb-2 font-bold text-indigo-600">
          Identifications du compte
        </h2>
        <p className="text-md pt-4">
          Pour expliquer plus en détail le processus, permettez-moi de vous donner une vue d'ensemble. La récupération des données s'effectue en utilisant une technique appelée "scrapping", qui consiste à extraire des informations à partir de pages web. Pour que cela fonctionne, j'ai besoin d'agir en tant qu'utilisateur autorisé, ce qui nécessite l'accès à votre compte.
        </p>
        <p className="text-md pt-4">
          Lorsque vous me fournissez le <code className="bg-zinc-800 text-slate-100">remember_user_token</code>, c'est comme si vous me donniez une clé d'accès spéciale. Je vais intégrer ce token dans chacune de mes requêtes vers les pages pertinentes. Lorsque les pages reçoivent cette requête, elles vérifient le token pour s'assurer que l'accès est autorisé. Une fois que le token est confirmé comme valide, j'obtiens l'accès à votre compte de la même manière que vous le feriez en vous connectant manuellement.
        </p>
        <p className="text-md pt-4">
          En résumé, le <code className="bg-zinc-800 text-slate-100">remember_user_token</code> agit comme une carte d'accès numérique, me permettant d'entrer dans votre compte et de collecter les informations nécessaires. Cela garantit que les données récupérées sont précises et reflètent fidèlement ce que vous auriez pu voir si vous aviez consulté vos pages vous-même.
        </p>

        <div className="mt-5 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 border rounded-md sm:mx-auto sm:w-full sm:max-w-md">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img className="mx-auto h-10 w-auto" src="https://www.codeur.com/blog/wp-content/uploads/2022/04/logo-codeur-com.png" alt="codeur.com" />
          </div>

          <div className="mt-10">
            <form className="space-y-5" action="#" method="POST">
              <div>
                <label htmlFor="remember_user_token" className="block text-sm font-medium leading-6 text-gray-900">remember_user_token</label>
                <div className="mt-2">
                  <input value={remember_user_token} onChange={(e) => setRememberUserToken(e.target.value)} id="remember_user_token" name="token" type="token" autoComplete="token" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm px-2 sm:leading-6" />
                </div>
              </div>
              <div>
                <button onClick={(e) => login()} type="button" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  {loginSubmitting && (
                    <div role="status">
                      <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-white-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  )}
                  Se connecter
                </button>
              </div>
              <div className="mt-5">
                {logged && (
                  <>
                    <div className="flex">
                      <img className="rounded-full my-auto" style={{maxHeight: "64px", maxWidth: "64px"}} alt="ma photo de profile" src={userData && userData.profile_picture} />
                      <div className="flex flex-col ms-3 ">
                        <h3 className="leading-tight text-lg font-semibold uppercase">{userData.user_id}#{userData.profile_name_slug}</h3>
                        <span className="leading-tight">{userData.offer_left} offres restantes</span>
                        <span className="leading-tight">{userData.rank} en position sur le site</span>
                      </div>
                    </div>
                    <p className="text-green-600">La connexion à compte à été établi avec succès</p>
                  </>
                )}
                {(logged != undefined && !logged) && (
                  <p className="text-red-600 mt-3">La connexion à compte à échoué</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
      <section className="mx-auto py-5 w-full px-5 lg:w-1/2">
        <h2 className="uppercase text-3xl pt-5 pb-2 font-bold text-indigo-600">
          Récupérations des projets
        </h2>
        <p className="text-md pt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex atque adipisci cupiditate provident accusamus repellendus, eos, nobis itaque possimus magnam porro ducimus quae dolorum consequatur doloribus quisquam vel totam debitis!</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
          <div className="">
            <div className="mt-5 flex flex-col justify-center px-6 py-12 lg:px-8 border rounded-md">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-10 w-auto" src="https://www.codeur.com/blog/wp-content/uploads/2022/04/logo-codeur-com.png" alt="codeur.com" />
              </div>

              <div className="mt-10">
                <form className="space-y-5" action="#" method="POST">
                  <SelectBox selections={categoriesList} selected={undefined} placeholder={"Choisir une catégorie"} onSelect={(value: any) => { setCategory(value) }} label={"Sélectionner une catégorie"} />
                  <SelectBox disabled={category == undefined} selections={category?.sections.map((section: string) => { return { name: section } }) ?? []} selected={undefined} onSelect={(value: any) => setSection(value.name)} label={"Choisir une section"} placeholder={"Sélectionner une section"} />
                  <div>
                    <label htmlFor="remember_user_token" className="block text-sm font-medium leading-6 text-gray-900">remember_user_token</label>
                    <div className="mt-2">
                      <input value={remember_user_token} disabled={true} id="remember_user_token" name="token" type="token" autoComplete="token" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm px-2 sm:leading-6" />
                    </div>
                  </div>
                  <div>
                    <button disabled={projects == undefined} onClick={(e) => fetchProjects()} type="button" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                      {
                        projects == undefined && (
                          <div role="status">
                            <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-white-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                          </div>
                        )
                      }
                      Récupérer les projets
                    </button>
                  </div>
                </form>
              </div>
            </div></div>
          <div className="col-span-2">
            <div className="w-300 overflow-y-scroll pe-3" style={{ maxHeight: "480px" }}>
              {projects != undefined && projects.map((project) => {
                return (<Project project={project} />)
              })}
            </div>
          </div>
        </div>
        <div>
          <div className="w-300 overflow-y-scroll pe-3  bg-zinc-700 rounded-md text-white" style={{ maxHeight: "480px" }}>
            <div className="space-y-5 p-5 ">
              <pre className="text-sm">
                {JSON.stringify(projects, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </section >
      <section id="offer" className="mx-auto py-5 w-full px-5 lg:w-1/2">
        <h2 className="uppercase text-3xl pt-5 pb-2 font-bold text-indigo-600">
          Formuler une offre avec l'IA
        </h2>
        <p className="text-md pt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex atque adipisci cupiditate provident accusamus repellendus, eos, nobis itaque possimus magnam porro ducimus quae dolorum consequatur doloribus quisquam vel totam debitis!</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
          <div className="col-span-3">
            <div className="mt-5 flex flex-col justify-center px-6 py-12 lg:px-8 border rounded-md">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-10 w-auto" src="https://www.codeur.com/blog/wp-content/uploads/2022/04/logo-codeur-com.png" alt="codeur.com" />
              </div>
              {project ? (
                <>
                  <Project project={project} />
                  <a href={project.url} target={"_blank"} className="mt-3 flex mx-auto justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    {
                      projects == undefined && (
                        <div role="status">
                          <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-white-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </div>
                      )
                    }
                    Visiter le projet sur codeur.com
                  </a>
                </>

              ) : (
                <p className="text-zinc-600 small text-center mt-5 leading-tight text-sm">Aucun projet n'a été sélectionné</p>
              )}
            </div>
          </div>
        </div>
      </section >
    </div >
  );
}
