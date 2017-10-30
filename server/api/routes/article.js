import verify from '../../middleware/verify';
import {
  createArticle,
  getArticles,
  updateArticle,
  getArticle,
  deleteArticle
} from '../../controllers/article';

export default async router => {
  // router.post("/article/add", verify, createArticle);
  router.post('/article/add', createArticle);
  router.all('/article/list', getArticles);
  router.all('/article', getArticle);
  router.post('/article/update', updateArticle);
  router.all('/article/delete', deleteArticle);
};
