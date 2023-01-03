import { Zettelkasten } from '@terezatech/zettel';
import * as path from 'path';

const postsDir = path.join(process.cwd(), './');
console.log(postsDir);

const zettelkasten = new Zettelkasten({ postsDir });

await (async () => {
	const posts = await zettelkasten.getPosts();

	console.log(posts);
	const blogPost = await zettelkasten.getPosts({ groups: ['blog'] });

	const tags = await zettelkasten.getTags();
})();
