import 'babel-polyfill';
import Koa from 'koa';
import error from 'koa-json-error';
import bodyParser from 'koa-bodyparser';
import fetch from 'node-fetch';
import ZeroCater from 'zerocater';

const ZEROCATER_SHORTCODE = process.env.ZEROCATER_SHORTCODE ||
  console.error('No ZeroCater shortcode set!') && ''; // eslint-disable-line no-console
const SLACK_TOKEN = process.env.SLACK_TOKEN ||
  console.error('No Slack token set!') && ''; // eslint-disable-line no-console
const PORT = process.env.PORT || 3000;

const zc = new ZeroCater(ZEROCATER_SHORTCODE);

const sendReplies = async (text, responseUrl) => {
  const meals = await zc.getMeals({
    range: text,
    timeFormat: 'dddd, M/D',
  });
  const attachments = meals.reduce(
    (allMeals, nextMeal, index) => {
      const meal = {
        fallback: `${nextMeal.time} - ${nextMeal.vendor_name}: ${nextMeal.name}`,
        color: index % 2 === 0 ? '#e31837' : '#f5f5f5',
        author_name: `${nextMeal.time} - ${nextMeal.vendor_name}`,
        title: nextMeal.name,
        title_link: `http://zerocater.com/m/${ZEROCATER_SHORTCODE}/${nextMeal.id}`,
        text: nextMeal.vendor_description,
        thumb_url: nextMeal.vendor_image_url,
        fields: [],
      };
      if (nextMeal.was_delivered) meal.fields.push({ value: '• Delivered', short: false });
      if (nextMeal.is_mindful) meal.fields.push({ value: '• Mindful Menu', short: false });
      return allMeals.concat(meal);
    }, []
  );
  const body = JSON.stringify({
    response_type: 'ephemeral',
    username: 'ZeroCater',
    text: `ZeroCater meals for "${text}":`,
    attachments,
  });
  fetch(responseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
};

const app = new Koa();
app.use(error());
app.use(bodyParser());
app.use(async ctx => {
  const { token, response_url: responseUrl, text } = ctx.request.body;
  if (token !== SLACK_TOKEN) {
    ctx.status = 403; // eslint-disable-line no-param-reassign
    ctx.body = { // eslint-disable-line no-param-reassign
      response_type: 'ephemeral',
      username: 'ZeroCater',
      text: 'Bad auth token!',
    };
    return;
  }

  sendReplies(text || 'today', responseUrl);

  ctx.body = { // eslint-disable-line no-param-reassign
    response_type: 'ephemeral',
    username: 'ZeroCater',
    text: 'Getting info...',
  };
});
app.listen(PORT, () => console.log(`Listening on port http://localhost:${PORT}`)); // eslint-disable-line no-console
