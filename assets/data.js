const DATA = {
  blocks: [
    {
      type: 'carousel',
      data: [
        {
          url: 'https://media.viezone.vn/prod/2020/12/5/21v_co_logo_cd2f252cce.jpg',
          caption: '',
        },
        {
          url: 'https://media.viezone.vn/prod/2020/12/22/21a_cbcebce5fc.jpg',
          caption: '',
        },
        {
          url: 'https://media.viezone.vn/prod/2020/12/22/21b_6a33ed8163.jpg',
          caption: '',
        },
      ],
    },
    {
      type: 'header',
      data: {
        text: 'Editor.js',
        level: 2,
        alignment: 'right',
      },
    },
    {
      type: 'video',
      data: {
        file: {
          url: 'https://media.viezone.vn/prod/2020/11/25/53082300_765845527343815_691633107282310619_n_48fe68a91d.mp4',
          id: '5fbe3cdcf340c000106e40bf',
        },
        caption:
          'Khoảnh khắc MC Trấn Thành hỏi Minh Tú về chuyện yêu Andree trên sóng truyền hình',
        withBorder: false,
        stretched: false,
        withBackground: false,
        withPoster:
          'https://media.viezone.vn/dev/2021/1/6/de_bruyne_01274f4fca.jpg',
      },
    },
    {
      type: 'video',
      data: {
        file: {
          url: 'https://www.youtube.com/watch?v=hgFXU10bhH0',
        },
        service: 'youtube',
        caption:
          'Khoảnh khắc MC Trấn Thành hỏi Minh Tú về chuyện yêu Andree trên sóng truyền hình',
        withBorder: false,
        stretched: false,
        withBackground: false,
        withPoster:
          'https://media.viezone.vn/dev/2021/1/6/de_bruyne_01274f4fca.jpg',
      },
    },

    {
      type: 'list',
      data: {
        items: [
          'It is a block-styled editor',
          'It returns clean data output in JSON',
          'Designed to be extendable and pluggable with a simple API',
        ],
        style: 'unordered',
      },
    },

    {
      type: 'paragraph',
      data: {
        text: 'Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js <mark class="cdx-marker">workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc</mark>. Each of them is an independent contenteditable element (or more complex structure) provided by Plugin and united by Editor\'s Core.',
        style: true,
      },
    },

    {
      type: 'delimiter',
      data: {},
    },

    {
      type: 'image',
      data: {
        url: 'assets/codex2x.png',
        caption: '',
        stretched: false,
        withBorder: true,
        withBackground: false,
      },
    },
  ],
};

const getData = (arrTypes) => {
  const blocks = [];

  DATA.blocks.forEach((d) => {
    if (arrTypes.includes(d.type)) {
      blocks.push(d);
    }
  });

  return {
    blocks,
  };
};
