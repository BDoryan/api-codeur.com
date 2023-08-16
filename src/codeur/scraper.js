import axios from 'axios';
import cheerio from 'cheerio';
//const { categories } = require("./codeur")

function slugify(text) {
    text = text.toLowerCase();
    text = text.normalize('NFKD').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase();

    text = text.replace(/[^\w\s-]/g, '');
    text = text.replace(/\s+/g, '-');

    return text;
}

const getCookies = () => {
    return "remember_user_token=" + remember_user_token + ";offer_user_token=" + offer_user_token;
}

var axiosInstance = undefined;
var offer_user_token = "";
var remember_user_token = "";

const setTokens = (offerToken, rememberToken) => {
    offer_user_token = offerToken;
    remember_user_token = rememberToken;
    const config = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            Cookie: getCookies()
        }
    };
    axiosInstance = axios.create(config);
};

const isLogged = () => {
    const url = "https://www.codeur.com/projects/c/web";

    return new Promise((resolve, reject) => {
        axiosInstance.get(url, {
            maxRedirects: 0
        })
            .then(response => {
                console.log(response)
                resolve(response.status == 200)
            })
            .catch(error => {
                resolve(false)
            });
    })
}


const getProjectDescription = async (project_id) => {
    return new Promise((resolve, reject) => {
        const url = "https://www.codeur.com/projects/" + project_id + "/project_preview";

        
        axiosInstance.get(url)
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            });
    })
}

const getProjects = async () => {
    try {
        const url = 'https://www.codeur.com/projects/c/web';
        const response = await axiosInstance.get(url);
        const $ = cheerio.load(response.data);

        const projectDivs = $('div[id^="project-"]');

        const projects = await Promise.all(projectDivs.map(async (index, element) => {
            const id = $(element).attr('id').replace("project-", "");

            const title = $(element).find('h3 a').text();
            const status = $(element).find('p.text-neutral-600 span').first().text().replace(" ", "");
            const budget = $(element).find('span[title="Budget indicatif"]').text();
            const numOffers = $(element).find('span[title="Nombre d\'offres"]').text();
            const views = $(element).find('span:contains("vues")').text();
            const interactions = $(element).find('span:contains("interactions")').text();
            const summary = $(element).find('[data-project-preview-target="summary"]').text();

            const description = await getProjectDescription(id);

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
                description
            };

            return project;
        }));

        return projects;
    } catch (error) {
        console.error('Error:', error);
    };

}

export { isLogged, getProjects, setTokens }