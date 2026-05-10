import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import User from './models/User.model.js';
import Channel from './models/Channel.model.js';
import Video from './models/Video.model.js';

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ MongoDB connected');

    await Video.deleteMany({});
    await Channel.deleteMany({});
    await User.deleteMany({ email: 'seed@youtube.com' });
    console.log('🗑️  Cleared old seed data');

    const user = await User.create({
      username: 'YouTubeAdmin',
      email: 'seed@youtube.com',
      password: 'seed123456',
    });

    const channels = await Channel.insertMany([
      { channelName: 'Code with John',      handle: '@CodeWithJohn',      owner: user._id, subscribers: 52000 },
      { channelName: 'freeCodeCamp',        handle: '@freeCodeCamp',      owner: user._id, subscribers: 980000 },
      { channelName: 'Traversy Media',      handle: '@TraversyMedia',     owner: user._id, subscribers: 210000 },
      { channelName: 'Academind',           handle: '@Academind',         owner: user._id, subscribers: 870000 },
      { channelName: 'WilliamFiset',        handle: '@WilliamFiset',      owner: user._id, subscribers: 45000 },
      { channelName: 'ChillVibes',          handle: '@ChillVibes',        owner: user._id, subscribers: 120000 },
      { channelName: 'Fireship',            handle: '@Fireship',          owner: user._id, subscribers: 2100000 },
      { channelName: 'Kevin Powell',        handle: '@KevinPowell',       owner: user._id, subscribers: 890000 },
      { channelName: 'The Coding Train',    handle: '@TheCodingTrain',    owner: user._id, subscribers: 1500000 },
      { channelName: 'TechWorld with Nana', handle: '@TechWorldWithNana', owner: user._id, subscribers: 760000 },
    ]);

    const [john, fcc, traversy, academind, william, chill, fireship, kevin, coding, nana] = channels;

    const videos = await Video.insertMany([
      // Web Development
      {
        title: 'Learn React in 30 Minutes',
        description: 'A quick tutorial to get started with React. We cover components, props, state, and hooks.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://i.ytimg.com/vi/Ke90Tje7VS0/hqdefault.jpg',
        category: 'Web Development', channel: john._id, uploader: user._id, views: 152000,
      },
      {
        title: 'CSS Grid and Flexbox Full Course',
        description: 'Master CSS layouts with Grid and Flexbox. Build responsive designs from scratch.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://i.ytimg.com/vi/t6CBKf8K_Ac/hqdefault.jpg',
        category: 'Web Development', channel: kevin._id, uploader: user._id, views: 280000,
      },
      {
        title: 'Build a Full Stack MERN App',
        description: 'Complete MERN stack tutorial — MongoDB, Express, React, Node.js from scratch.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://i.ytimg.com/vi/7CqJlxBYj-M/hqdefault.jpg',
        category: 'Web Development', channel: traversy._id, uploader: user._id, views: 430000,
      },
      {
        title: 'HTML & CSS Full Course for Beginners',
        description: 'Learn HTML and CSS from zero to hero. Build real websites step by step.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://i.ytimg.com/vi/mU6anWqZJcc/hqdefault.jpg',
        category: 'Web Development', channel: fcc._id, uploader: user._id, views: 890000,
      },
      // JavaScript
      {
        title: 'JavaScript Full Course for Beginners',
        description: 'Complete JavaScript tutorial from scratch. Variables, functions, arrays, objects, and more.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://i.ytimg.com/vi/PkZNo7MFNFg/hqdefault.jpg',
        category: 'JavaScript', channel: fcc._id, uploader: user._id, views: 980000,
      },
      {
        title: 'React Hooks Complete Guide',
        description: 'Deep dive into React Hooks: useState, useEffect, useContext, useRef, and custom hooks.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://i.ytimg.com/vi/O6P86uwfdR0/hqdefault.jpg',
        category: 'JavaScript', channel: fcc._id, uploader: user._id, views: 540000,
      },
      {
        title: 'JavaScript in 100 Seconds',
        description: 'JavaScript explained in 100 seconds. Fast, fun, and informative.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://i.ytimg.com/vi/DHjqpvDnNGE/hqdefault.jpg',
        category: 'JavaScript', channel: fireship._id, uploader: user._id, views: 3200000,
      },
      {
        title: 'Async JavaScript – Callbacks, Promises, Async/Await',
        description: 'Master asynchronous JavaScript with callbacks, promises, and async/await.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://i.ytimg.com/vi/PoRJizFvM7s/hqdefault.jpg',
        category: 'JavaScript', channel: traversy._id, uploader: user._id, views: 670000,
      },
      // Server
      {
        title: 'Node.js and Express Full Tutorial',
        description: 'Build a REST API with Node.js and Express. Covers routing, middleware, and MongoDB.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://i.ytimg.com/vi/Oe421EPjeBE/hqdefault.jpg',
        category: 'Server', channel: traversy._id, uploader: user._id, views: 320000,
      },
      {
        title: 'REST API Design Best Practices',
        description: 'Learn how to design clean, scalable REST APIs with proper status codes and structure.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://i.ytimg.com/vi/7nm1pYuKAhY/hqdefault.jpg',
        category: 'Server', channel: academind._id, uploader: user._id, views: 180000,
      },
      // Data Structures
      {
        title: 'Data Structures Easy to Advanced',
        description: 'Complete data structures course. Arrays, linked lists, trees, graphs, and more.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://i.ytimg.com/vi/RBSGKlAvoiM/hqdefault.jpg',
        category: 'Data Structures', channel: william._id, uploader: user._id, views: 450000,
      },
      {
        title: 'Sorting Algorithms Visualized',
        description: 'Visual explanation of bubble sort, merge sort, quick sort, and more.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://i.ytimg.com/vi/kPRA0W1kECg/hqdefault.jpg',
        category: 'Data Structures', channel: coding._id, uploader: user._id, views: 920000,
      },
      // Information Technology
      {
        title: 'MongoDB Full Tutorial for Beginners',
        description: 'Learn MongoDB from scratch. CRUD operations, aggregation, and Mongoose ODM.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://i.ytimg.com/vi/-56x56UppqQ/hqdefault.jpg',
        category: 'Information Technology', channel: academind._id, uploader: user._id, views: 670000,
      },
      {
        title: 'Docker Tutorial for Beginners',
        description: 'Learn Docker from scratch. Containers, images, volumes, and Docker Compose.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://i.ytimg.com/vi/3c-iBn73dDE/hqdefault.jpg',
        category: 'Information Technology', channel: nana._id, uploader: user._id, views: 1200000,
      },
      {
        title: 'Git and GitHub Full Course',
        description: 'Master Git version control and GitHub. Branching, merging, pull requests, and more.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://i.ytimg.com/vi/RGOj5yH7evk/hqdefault.jpg',
        category: 'Information Technology', channel: fcc._id, uploader: user._id, views: 2100000,
      },
      // Music
      {
        title: 'Relaxing Music for Studying and Focus',
        description: 'Calm background music to help you focus while coding or studying.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg',
        category: 'Music', channel: chill._id, uploader: user._id, views: 2100000,
      },
      {
        title: 'Lo-Fi Hip Hop Radio – Beats to Study',
        description: '24/7 lo-fi hip hop radio. Perfect background music for coding sessions.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
        category: 'Music', channel: chill._id, uploader: user._id, views: 8900000,
      },
    ]);

    // Link videos to channels
    for (const video of videos) {
      await Channel.findByIdAndUpdate(video.channel, { $push: { videos: video._id } });
    }

    await User.findByIdAndUpdate(user._id, {
      $push: { channels: { $each: channels.map(c => c._id) } }
    });

    console.log(`✅ Seeded ${videos.length} videos across ${channels.length} channels`);
    console.log('🎉 Done!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seedData();
