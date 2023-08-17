import axios from 'axios';
import cheerio from 'cheerio';
//const { categories } = require("./codeur")

function slugify(text: string) {
    text = text.toLowerCase();
    text = text.normalize('NFKD').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase();

    text = text.replace(/[^\w\s-]/g, '');
    text = text.replace(/\s+/g, '-');

    return text;
}

const getCookies = (remember_user_token: string) => {
    return "remember_user_token=" + remember_user_token;
}

const isLogged = (remember_user_token: string) => {
    const config = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            Cookie: getCookies(remember_user_token)
        }
    };
    const axiosInstance = axios.create(config);

    const url = "https://www.codeur.com/projects/c/web";

    return new Promise((resolve, reject) => {
        axiosInstance.get(url, {
            maxRedirects: 0
        }).then((response: any) => {
            resolve(response.status == 200)
        }).catch((error: any) => {
            resolve(false)
        });
    })
}


const getProjectDescription = async (remember_user_token: string, project_id: number) => {
    const config = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            Cookie: getCookies(remember_user_token)
        }
    };
    const axiosInstance = axios.create(config);

    return new Promise((resolve, reject) => {
        const url = "https://www.codeur.com/projects/" + project_id + "/project_preview";


        axiosInstance.get(url)
            .then((response: any) => {
                resolve(response.data)
            })
            .catch((error: any) => {
                reject(error)
            });
    })
}

const getProjects = async (remember_user_token: string, category: string|undefined, section: string|undefined) => {
    const config = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            Cookie: getCookies(remember_user_token)
        }
    };
    const axiosInstance = axios.create(config);

    try {
        const url = 'https://www.codeur.com/projects/' + (category != undefined ? 'c/' + category + '/' + (section != undefined ? 'sc/' + section : "") : "");
        console.log("url -> ", url)
        const response = await axiosInstance.get(url);
        const $ = cheerio.load(response.data);

        const projectDivs = $('div[id^="project-"]');

        const projects = await Promise.all(projectDivs.map(async (index, element) => {
            const id = Number.parseInt($(element).attr('id')?.replace("project-", "") ?? "-1");

            const title = $(element).find('h3 a').text();
            const status = $(element).find('p.text-neutral-600 span').first().text().replace(" ", "");
            const budget = $(element).find('span[title="Budget indicatif"]').text();
            const numOffers = $(element).find('span[title="Nombre d\'offres"]').text();
            const views = $(element).find('span:contains("vues")').text();
            const interactions = $(element).find('span:contains("interactions")').text();
            const summary = $(element).find('[data-project-preview-target="summary"]').text();
            const givedOffer = $(element).find("span.text-warning").text();

            const description = await getProjectDescription(remember_user_token, id);

            const project =
            {
                id,
                url: "https://www.codeur.com/projects/" + id,
                title,
                status,
                budget,
                numOffers,
                views,
                interactions,
                summary,
                description,
                givedOffer
            };

            return project;
        }));

        return projects;
    } catch (error) {
        console.error('Error:', error);
    };

}

export { isLogged, getProjects }