import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search, TrendingUp, TrendingDown, Target, Activity,
  Clock, MapPin, Calendar, Flame, AlertTriangle, Trophy,
  Filter, BarChart3, Layers, Cpu, Sparkles, Lock, Check, X,
  ArrowRight, ArrowUp, ArrowDown, DollarSign, Users, Radio,
  Crosshair, Info, AlertCircle, BookOpen, Code, Beaker, Plus, Minus,
  ChevronRight, Star, Gauge, Percent, Swords, ListChecks, History,
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, AreaChart, Area, ReferenceLine, ScatterChart, Scatter,
  Cell, Legend, ComposedChart,
} from 'recharts';

// ═══════════════════════════════════════════════════════════════════════
// REAL FIGHTER DATA — UFC.com / ESPN / Wikipedia / MVP (May 15, 2026)
// ═══════════════════════════════════════════════════════════════════════

const FIGHTERS = {
  topuria: { id:'topuria', name:'Ilia Topuria', nick:'El Matador', country:'🇪🇸', age:29,
    height:"5'7\"", reach:69, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'17-0-0', wins:17, losses:0, rank:'C', p4p:2, color:'#dc2626',
    slpm:4.81, strAcc:50.86, tdAvg:1.96, tdAcc:61.11, subAvg:1.07,
    style:'Boxing-Heavy Pressure', camp:'Climent Club', streak:'W17',
    notes:'First unbeaten 2-division champ in UFC history. KO wins over Volkanovski, Holloway, Oliveira.',
    last:'W KO1 vs Oliveira · UFC 317' },
  gaethje: { id:'gaethje', name:'Justin Gaethje', nick:'The Highlight', country:'🇺🇸', age:37,
    height:"5'11\"", reach:70, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'27-5-0', wins:27, losses:5, rank:'IC', p4p:null, color:'#f59e0b',
    slpm:6.48, strAcc:60.25, tdAvg:0.33, tdAcc:40, subAvg:0,
    style:'Pressure Brawler / Leg Kicks', camp:'Trevor Wittman / ONX', streak:'W2',
    notes:'BMF & interim LW champ. Recent decision wins over Pimblett and Fiziev.',
    last:'W DEC vs Pimblett · UFC 324' },
  allen: { id:'allen', name:'Arnold Allen', nick:'Almighty', country:'🇬🇧', age:32,
    height:"5'10\"", reach:71, stance:'Southpaw', weight:'Featherweight', division:'FW',
    record:'20-4-0', wins:20, losses:4, rank:8, p4p:null, color:'#0ea5e9',
    slpm:4.38, strAcc:59.4, tdAvg:2.0, tdAcc:40.74, subAvg:1.09,
    style:'Slick Southpaw Counter', camp:'Team KF', streak:'L1',
    notes:'Was undefeated through 9 UFC fights. On a 1-3 stretch entering Costa.',
    last:'L DEC vs Silva · UFC 324' },
  costa: { id:'costa', name:'Melquizael Costa', nick:'Melk', country:'🇧🇷', age:29,
    height:"5'8\"", reach:70, stance:'Southpaw', weight:'Featherweight', division:'FW',
    record:'26-7-0', wins:26, losses:7, rank:12, p4p:null, color:'#16a34a',
    slpm:3.47, strAcc:44.94, tdAvg:0.86, tdAcc:47.83, subAvg:0.31,
    style:'Volume Striker / Kicks', camp:'Chute Boxe Diego Lima', streak:'W6',
    notes:'Six-fight win streak. First to stop Dan Ige (spinning back kick).',
    last:'W KO vs Ige · UFC FN' },
  pereira: { id:'pereira', name:'Alex Pereira', nick:'Poatan', country:'🇧🇷', age:38,
    height:"6'4\"", reach:79, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'13-3-0', wins:13, losses:3, rank:null, p4p:3, color:'#a855f7',
    slpm:4.6, strAcc:62.1, tdAvg:0, tdAcc:0, subAvg:0,
    style:'Glory-Caliber Kickboxer', camp:'Teixeira MMA', streak:'W1',
    notes:'Highest sig-strike accuracy in UFC history (62.1%). 2x LHW champ. HW debut.',
    last:'W TKO1 vs Ankalaev · UFC 320' },
  gane: { id:'gane', name:'Ciryl Gane', nick:'Bon Gamin', country:'🇫🇷', age:35,
    height:"6'4\"", reach:81, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'13-3-0', wins:13, losses:3, rank:2, p4p:null, color:'#06b6d4',
    slpm:4.9, strAcc:55, tdAvg:0.6, tdAcc:35, subAvg:0.2,
    style:'Movement-Based Kickboxer', camp:'MMA Factory Paris', streak:'W2',
    notes:'Former interim HW champ. Lost title fights to Ngannou and Jones.',
    last:'W DEC · UFC 325' },
  makhachev: { id:'makhachev', name:'Islam Makhachev', nick:'The Eagle Heir', country:'🇷🇺', age:34,
    height:"5'10\"", reach:70.5, stance:'Southpaw', weight:'Welterweight', division:'WW',
    record:'28-1-0', wins:28, losses:1, rank:'C', p4p:1, color:'#dc2626',
    slpm:3.84, strAcc:56, tdAvg:3.91, tdAcc:64, subAvg:1.4,
    style:'Sambo-Heavy Grappler', camp:'AKA / Eagle MMA', streak:'W16',
    notes:'16-fight streak ties Anderson Silva. Two-division champ.',
    last:'W DEC vs JDM · UFC 322' },
  strickland: { id:'strickland', name:'Sean Strickland', nick:'Tarzan', country:'🇺🇸', age:35,
    height:"6'1\"", reach:76, stance:'Switch', weight:'Middleweight', division:'MW',
    record:'30-7-0', wins:30, losses:7, rank:'C', p4p:5, color:'#eab308',
    slpm:4.5, strAcc:43, tdAvg:0.6, tdAcc:35, subAvg:0.1,
    style:'Defensive Volume Boxer', camp:'Xtreme Couture', streak:'W2',
    notes:'NEW MW Champ — upset Chimaev at UFC 328 (May 9, 2026). 2x MW champion.',
    last:'W DEC vs Chimaev · UFC 328' },
  chimaev: { id:'chimaev', name:'Khamzat Chimaev', nick:'Borz', country:'🇸🇪', age:31,
    height:"6'2\"", reach:75, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'15-1-0', wins:15, losses:1, rank:9, p4p:9, color:'#71717a',
    slpm:4.2, strAcc:55, tdAvg:5.2, tdAcc:48, subAvg:1.0,
    style:'Wrestle-Box Pressure', camp:'Allstars Training Center', streak:'L1',
    notes:'Lost title to Strickland at UFC 328 — first career loss. Eyeing move to 205.',
    last:'L DEC vs Strickland · UFC 328' },
  omalley: { id:'omalley', name:"Sean O'Malley", nick:'Sugar', country:'🇺🇸', age:31,
    height:"5'11\"", reach:72, stance:'Switch', weight:'Bantamweight', division:'BW',
    record:'18-2-0', wins:18, losses:2, rank:2, p4p:null, color:'#eab308',
    slpm:5.43, strAcc:56, tdAvg:0.2, tdAcc:33, subAvg:0.4,
    style:'Range Striker / Snipe', camp:'MMA Lab', streak:'L1',
    notes:'Two losses to Dvalishvili. Rebuilding via Zahabi at Freedom 250.',
    last:'L DEC vs Dvalishvili · UFC 316' },
  zahabi: { id:'zahabi', name:'Aiemann Zahabi', nick:'—', country:'🇨🇦', age:37,
    height:"5'7\"", reach:67, stance:'Orthodox', weight:'Bantamweight', division:'BW',
    record:'13-2-0', wins:13, losses:2, rank:13, p4p:null, color:'#3b82f6',
    slpm:3.5, strAcc:48, tdAvg:0.4, tdAcc:40, subAvg:0.2,
    style:'Karate-Based Counter', camp:'Tristar (Firas Zahabi)', streak:'W5',
    notes:'Brother of head coach Firas Zahabi. Heavy underdog vs O\'Malley.',
    last:'W' },
  song: { id:'song', name:'Song Yadong', nick:'Kung Fu Monkey', country:'🇨🇳', age:28,
    height:"5'8\"", reach:67, stance:'Orthodox', weight:'Bantamweight', division:'BW',
    record:'22-9-1', wins:22, losses:9, rank:5, p4p:null, color:'#ef4444',
    slpm:4.6, strAcc:41, tdAvg:0.5, tdAcc:32, subAvg:0.3,
    style:'Hooks & Body Kicks', camp:'Team Alpha Male', streak:'W1',
    notes:'Headlines UFC FN Macau vs Figueiredo.', last:'W' },
  figgy: { id:'figgy', name:'Deiveson Figueiredo', nick:'Deus da Guerra', country:'🇧🇷', age:38,
    height:"5'5\"", reach:68, stance:'Orthodox', weight:'Bantamweight', division:'BW',
    record:'25-6-1', wins:25, losses:6, rank:7, p4p:null, color:'#f97316',
    slpm:4.1, strAcc:50, tdAvg:1.4, tdAcc:40, subAvg:1.2,
    style:'BJJ-Heavy Brawler', camp:'Pitbull Brothers', streak:'W1',
    notes:'Two-time former FLW champ, moved up to BW.', last:'W' },
  belal: { id:'belal', name:'Belal Muhammad', nick:'Remember The Name', country:'🇺🇸', age:37,
    height:"5'10\"", reach:72, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'24-5-0', wins:24, losses:5, rank:4, p4p:null, color:'#84cc16',
    slpm:4.3, strAcc:48, tdAvg:2.1, tdAcc:38, subAvg:0.2,
    style:'Pressure Wrestler', camp:'Roufusport', streak:'W1',
    notes:'Former WW champ. Lost belt to JDM in 2026.', last:'W' },
  bonfim: { id:'bonfim', name:'Gabriel Bonfim', nick:'Marreta', country:'🇧🇷', age:28,
    height:"6'1\"", reach:75, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'19-1-0', wins:19, losses:1, rank:10, p4p:null, color:'#06b6d4',
    slpm:3.5, strAcc:50, tdAvg:2.5, tdAcc:55, subAvg:2.1,
    style:'BJJ Wizard / Submissions', camp:'Bonfim Brothers', streak:'W3',
    notes:'Submission specialist on a 6-fight UFC run.', last:'W SUB' },
  kape: { id:'kape', name:'Manel Kape', nick:'Starboy', country:'🇵🇹', age:32,
    height:"5'5\"", reach:68, stance:'Southpaw', weight:'Flyweight', division:'FLW',
    record:'22-7-0', wins:22, losses:7, rank:1, p4p:null, color:'#dc2626',
    slpm:5.04, strAcc:57.02, tdAvg:0.40, tdAcc:30, subAvg:0.27,
    style:'Explosive Striker', camp:'Sikjitsu', streak:'W3',
    notes:'#1 FLW contender. Headlines UFC FN June 20.', last:'W' },
  horiguchi: { id:'horiguchi', name:'Kyoji Horiguchi', nick:'—', country:'🇯🇵', age:35,
    height:"5'4\"", reach:63, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'36-5-0', wins:36, losses:5, rank:6, p4p:null, color:'#3b82f6',
    slpm:3.77, strAcc:56.93, tdAvg:1.61, tdAcc:40.54, subAvg:0.11,
    style:'Speed & Footwork', camp:'American Top Team', streak:'W2',
    notes:'Former RIZIN & Bellator champ. Veteran of 41 pro fights.', last:'W' },
  fiziev: { id:'fiziev', name:'Rafael Fiziev', nick:'Ataman', country:'🇦🇿', age:33,
    height:"5'8\"", reach:71, stance:'Switch', weight:'Lightweight', division:'LW',
    record:'13-5-0', wins:13, losses:5, rank:11, p4p:null, color:'#f59e0b',
    slpm:4.71, strAcc:54.87, tdAvg:0.83, tdAcc:66.67, subAvg:0,
    style:'Muay Thai Technician', camp:'Tiger Muay Thai', streak:'L1',
    notes:'Elite striker. Headlines UFC Baku.', last:'L DEC vs Gaethje' },
  torres: { id:'torres', name:'Manuel Torres', nick:'El Loco', country:'🇲🇽', age:31,
    height:"5'10\"", reach:73, stance:'Switch', weight:'Lightweight', division:'LW',
    record:'17-3-0', wins:17, losses:3, rank:14, p4p:null, color:'#16a34a',
    slpm:7.29, strAcc:60.37, tdAvg:1.72, tdAcc:66.67, subAvg:0.86,
    style:'High-Output Finisher', camp:'Entram Gym', streak:'W3',
    notes:'Mexican fan favorite. Highest SLpM among ranked LWs.', last:'W' },
  rousey: { id:'rousey', name:'Ronda Rousey', nick:'Rowdy', country:'🇺🇸', age:39,
    height:"5'6\"", reach:66, stance:'Orthodox', weight:'Featherweight', division:'FW',
    record:'12-2-0', wins:12, losses:2, rank:null, p4p:null, color:'#e11d48',
    slpm:3.0, strAcc:42, tdAvg:3.5, tdAcc:55, subAvg:2.0,
    style:'Judo / Armbar Specialist', camp:'—', streak:'L2',
    notes:'Former UFC W-Bantamweight champ. First MMA fight since 2016 (loss to Nunes).',
    last:'L KO vs Nunes · UFC 207 (2016)' },
  carano: { id:'carano', name:'Gina Carano', nick:'Conviction', country:'🇺🇸', age:43,
    height:"5'8\"", reach:66.5, stance:'Orthodox', weight:'Featherweight', division:'FW',
    record:'7-1-0', wins:7, losses:1, rank:null, p4p:null, color:'#f43f5e',
    slpm:3.2, strAcc:40, tdAvg:1.0, tdAcc:30, subAvg:0.3,
    style:'Muay Thai Striker', camp:'—', streak:'L1',
    notes:'MMA pioneer. First fight since 2009 (TKO loss to Cris Cyborg).',
    last:'L TKO vs Cyborg (2009)' },
  ndiaz: { id:'ndiaz', name:'Nate Diaz', nick:'—', country:'🇺🇸', age:41,
    height:"6'0\"", reach:76, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'21-13-0', wins:21, losses:13, rank:null, p4p:null, color:'#1d4ed8',
    slpm:4.5, strAcc:44, tdAvg:0.6, tdAcc:30, subAvg:0.8,
    style:'Boxing / BJJ Cardio', camp:'—', streak:'W1',
    notes:'Stockton legend. First MMA fight since submitting Ferguson at UFC 279 (2022).',
    last:'W SUB vs Ferguson · UFC 279' },
  perry: { id:'perry', name:'Mike Perry', nick:'Platinum', country:'🇺🇸', age:34,
    height:"5'10\"", reach:71, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'14-8-0', wins:14, losses:8, rank:null, p4p:null, color:'#0284c7',
    slpm:3.9, strAcc:50, tdAvg:0.3, tdAcc:25, subAvg:0.1,
    style:'Heavy-Handed Brawler', camp:'—', streak:'W1',
    notes:'Returns to MMA after a dominant 6-0 bare-knuckle run.', last:'BKFC run 6-0' },
  ngannou: { id:'ngannou', name:'Francis Ngannou', nick:'The Predator', country:'🇨🇲', age:39,
    height:"6'4\"", reach:83, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'18-3-0', wins:18, losses:3, rank:null, p4p:null, color:'#b91c1c',
    slpm:3.4, strAcc:54, tdAvg:0.3, tdAcc:40, subAvg:0.2,
    style:'One-Punch KO Power', camp:'—', streak:'W1',
    notes:'Former UFC HW champ. Guinness record for hardest punch ever measured.', last:'W' },
  lins: { id:'lins', name:'Philipe Lins', nick:'Monstro', country:'🇧🇷', age:35,
    height:"6'2\"", reach:78, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'18-5-0', wins:18, losses:5, rank:null, p4p:null, color:'#15803d',
    slpm:3.6, strAcc:48, tdAvg:1.2, tdAcc:45, subAvg:0.6,
    style:'Well-Rounded Veteran', camp:'—', streak:'W2',
    notes:'2018 PFL Heavyweight Tournament winner ($1M prize).', last:'W' },
  volk: { id:'volk', name:'Alexander Volkanovski', nick:'The Great', country:'🇦🇺', age:37,
    height:"5'6\"", reach:71.5, stance:'Orthodox', weight:'Featherweight', division:'FW',
    record:'28-4-0', wins:28, losses:4, rank:'C', p4p:4, color:'#10b981',
    slpm:6.55, strAcc:56, tdAvg:1.55, tdAcc:38, subAvg:0.4,
    style:'Hybrid Pressure', camp:'City Kickboxing', streak:'W2',
    notes:'Two-time FW champ.', last:'W DEC vs Lopes 2 · UFC 325' },

  // ─── ALLEN vs COSTA undercard ───
  choi: { id:'choi', name:'Doo Ho Choi', nick:'The Korean Superboy', country:'🇰🇷', age:35,
    height:"5'9\"", reach:71, stance:'Orthodox', weight:'Featherweight', division:'FW',
    record:'16-4-1', wins:16, losses:4, rank:null, p4p:null, color:'#ef4444',
    slpm:4.9, strAcc:48, tdAvg:0.3, tdAcc:33, subAvg:0.2,
    style:'Explosive KO Striker', camp:'Korean Top Team', streak:'W3',
    notes:'Returned from military service; finished Nate Landwehr via crucifix. Heavy hands.', last:'W KO2 vs Yoo' },
  dsantos: { id:'dsantos', name:'Daniel Santos', nick:'Willycat', country:'🇧🇷', age:31,
    height:"5'8\"", reach:70, stance:'Switch', weight:'Featherweight', division:'FW',
    record:'14-2-0', wins:14, losses:2, rank:null, p4p:null, color:'#22c55e',
    slpm:4.4, strAcc:46, tdAvg:1.1, tdAcc:42, subAvg:0.4,
    style:'High-Pace Pressure', camp:'Fight Sports', streak:'W4',
    notes:'Four-fight UFC win streak; high cardio and volume.', last:'W TKO2 vs Yoo Joo-sang' },
  wellmaker: { id:'wellmaker', name:'Malcolm Wellmaker', nick:'Malcolm X', country:'🇺🇸', age:32,
    height:"5'7\"", reach:68, stance:'Orthodox', weight:'Bantamweight', division:'BW',
    record:'10-1-0', wins:10, losses:1, rank:null, p4p:null, color:'#f59e0b',
    slpm:5.6, strAcc:52, tdAvg:0.4, tdAcc:35, subAvg:0.2,
    style:'One-Shot KO Power', camp:'Spartan Fitness', streak:'L1',
    notes:'Three of four UFC wins ended in round 1; first loss to Ethyn Ewing.', last:'L DEC vs Ewing' },
  jdiaz: { id:'jdiaz', name:'Juan Diaz', nick:'Pegajoso', country:'🇵🇪', age:28,
    height:"5'7\"", reach:68, stance:'Orthodox', weight:'Bantamweight', division:'BW',
    record:'15-1-1', wins:15, losses:1, rank:null, p4p:null, color:'#06b6d4',
    slpm:3.9, strAcc:45, tdAvg:2.6, tdAcc:48, subAvg:0.9,
    style:'Pressure Grappler', camp:'Pitbull Peru', streak:'W2',
    notes:'Never finished in his career; spinning-back-elbow KO on Contender Series.', last:'W KO vs Contender' },
  bukauskas: { id:'bukauskas', name:'Modestas Bukauskas', nick:'The Baltic Gladiator', country:'🇱🇹', age:32,
    height:"6'2\"", reach:78, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'19-7-0', wins:19, losses:7, rank:null, p4p:null, color:'#3b82f6',
    slpm:4.2, strAcc:50, tdAvg:1.0, tdAcc:45, subAvg:0.4,
    style:'Volume Kickboxer', camp:'Combat Academy', streak:'L1',
    notes:'Won four straight before a KO loss to Nikita Krylov; finishes regularly.', last:'L KO vs Krylov' },
  cedwards: { id:'cedwards', name:'Christian Edwards', nick:'C4', country:'🇺🇸', age:29,
    height:"6'2\"", reach:79, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'8-4-0', wins:8, losses:4, rank:null, p4p:null, color:'#a855f7',
    slpm:3.6, strAcc:47, tdAvg:1.6, tdAcc:44, subAvg:0.6,
    style:'Athletic Finisher', camp:'Sanford MMA', streak:'W2',
    notes:'Short-notice UFC debut; six of eight wins by finish, four in round 1.', last:'W (regional)' },
  cuamba: { id:'cuamba', name:'Timmy Cuamba', nick:'—', country:'🇺🇸', age:30,
    height:"5'9\"", reach:70, stance:'Orthodox', weight:'Bantamweight', division:'BW',
    record:'10-3-0', wins:10, losses:3, rank:null, p4p:null, color:'#84cc16',
    slpm:4.3, strAcc:47, tdAvg:1.4, tdAcc:42, subAvg:0.3,
    style:'Boxing + Wrestling', camp:'MMA Lab', streak:'W1',
    notes:'3-2 in the UFC; improved takedown defense in last outing.', last:'W DEC vs Lee' },
  sopaj: { id:'sopaj', name:'Benardo Sopaj', nick:'—', country:'🇦🇱', age:28,
    height:"5'8\"", reach:69, stance:'Orthodox', weight:'Bantamweight', division:'BW',
    record:'12-3-0', wins:12, losses:3, rank:null, p4p:null, color:'#dc2626',
    slpm:3.4, strAcc:43, tdAvg:1.2, tdAcc:40, subAvg:0.5,
    style:'Counter Grappler', camp:'Allstars', streak:'L1',
    notes:'1-1 in the UFC, low activity; struggled vs Ricky Turcios.', last:'L DEC vs Turcios' },
  veretennikov: { id:'veretennikov', name:'Nikolay Veretennikov', nick:'—', country:'🇺🇿', age:32,
    height:"5'11\"", reach:73, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'9-4-0', wins:9, losses:4, rank:null, p4p:null, color:'#0ea5e9',
    slpm:3.7, strAcc:44, tdAvg:0.5, tdAcc:30, subAvg:0.1,
    style:'Kickboxer', camp:'Tiger Muay Thai', streak:'L1',
    notes:'Struggles defensively; gets taken down and out-grappled.', last:'L' },
  khaos: { id:'khaos', name:'Khaos Williams', nick:'The Oxfighter', country:'🇺🇸', age:31,
    height:"5'10\"", reach:74, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'15-5-0', wins:15, losses:5, rank:null, p4p:null, color:'#eab308',
    slpm:4.1, strAcc:46, tdAvg:0.2, tdAcc:25, subAvg:0,
    style:'Explosive KO Power', camp:'Fortis MMA', streak:'L1',
    notes:'Devastating one-punch power but recent form rocky; submitted and outstruck lately.', last:'L vs Gustafsson' },
  erslan: { id:'erslan', name:'Ivan Erslan', nick:'—', country:'🇭🇷', age:32,
    height:"6'0\"", reach:75, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'14-6-0', wins:14, losses:6, rank:null, p4p:null, color:'#16a34a',
    slpm:3.8, strAcc:45, tdAvg:0.9, tdAcc:38, subAvg:0.3,
    style:'Power Striker', camp:'Croatia Top Team', streak:'L1',
    notes:'Heavy hands; lost last bout largely on wrestling.', last:'L DEC' },
  tokkos: { id:'tokkos', name:'Tuco Tokkos', nick:'—', country:'🇬🇧', age:30,
    height:"6'1\"", reach:76, stance:'Southpaw', weight:'Light Heavyweight', division:'LHW',
    record:'11-5-0', wins:11, losses:5, rank:null, p4p:null, color:'#f97316',
    slpm:3.6, strAcc:43, tdAvg:1.1, tdAcc:36, subAvg:0.2,
    style:'Rangy Southpaw', camp:'—', streak:'W1',
    notes:'Won last fight after opponent gassed; not a strong wrestler.', last:'W DEC' },
  gantt: { id:'gantt', name:'Thomas Gantt', nick:'—', country:'🇺🇸', age:29,
    height:"5'10\"", reach:72, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'11-0-0', wins:11, losses:0, rank:null, p4p:null, color:'#dc2626',
    slpm:4.5, strAcc:50, tdAvg:2.8, tdAcc:52, subAvg:0.6,
    style:'Wrestle-Boxing', camp:'AKA (w/ Cormier)', streak:'W11',
    notes:'Undefeated; improved wrestling and takedowns on Contender Series.', last:'W DEC' },
  minev: { id:'minev', name:'Artur Minev', nick:'—', country:'🇺🇦', age:27,
    height:"5'10\"", reach:71, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'7-0-0', wins:7, losses:0, rank:null, p4p:null, color:'#3b82f6',
    slpm:4.4, strAcc:49, tdAvg:1.0, tdAcc:40, subAvg:0.8,
    style:'Aggressive Finisher', camp:'—', streak:'W7',
    notes:'Short-notice UFC debut; six of seven wins by finish, five in round 1.', last:'W (regional)' },
  vieira: { id:'vieira', name:'Ketlen Vieira', nick:'Fenômeno', country:'🇧🇷', age:34,
    height:"5'7\"", reach:69, stance:'Orthodox', weight:"Women's Bantamweight", division:'WBW',
    record:'15-5-0', wins:15, losses:5, rank:5, p4p:null, color:'#e11d48',
    slpm:2.9, strAcc:42, tdAvg:2.4, tdAcc:46, subAvg:0.6,
    style:'Physical Wrestler', camp:'Nova União', streak:'L1',
    notes:'Top-5 bantamweight; competitive with Dumont, Harrison and Pennington.', last:'L DEC vs Dumont' },
  cavalcanti: { id:'cavalcanti', name:'Jacqueline Cavalcanti', nick:'—', country:'🇧🇷', age:32,
    height:"5'9\"", reach:70, stance:'Orthodox', weight:"Women's Bantamweight", division:'WBW',
    record:'10-1-0', wins:10, losses:1, rank:11, p4p:null, color:'#f43f5e',
    slpm:4.6, strAcc:49, tdAvg:0.4, tdAcc:30, subAvg:0.1,
    style:'Volume Striker', camp:'American Top Team', streak:'W2',
    notes:'Sharp, rangy striker on the rise at 135.', last:'W DEC' },
  petroski: { id:'petroski', name:'Andre Petroski', nick:'The Future', country:'🇺🇸', age:34,
    height:"5'11\"", reach:74, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'13-5-0', wins:13, losses:5, rank:null, p4p:null, color:'#0ea5e9',
    slpm:3.2, strAcc:48, tdAvg:3.2, tdAcc:50, subAvg:1.4,
    style:'Wrestle-Grappler', camp:'Renzo Gracie Philly', streak:'W1',
    notes:'Strong top game and submission threat; TUF alum.', last:'W SUB' },
  brundage: { id:'brundage', name:'Cody Brundage', nick:'The Spartan', country:'🇺🇸', age:33,
    height:"6'0\"", reach:74, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'11-9-1', wins:11, losses:9, rank:null, p4p:null, color:'#71717a',
    slpm:3.3, strAcc:44, tdAvg:2.0, tdAcc:42, subAvg:0.5,
    style:'Scrambly Wrestler', camp:'Glory MMA', streak:'L1',
    notes:'Chaotic fights; mixed UFC results.', last:'L' },
  ardelean: { id:'ardelean', name:'Alice Ardelean', nick:'—', country:'🇷🇴', age:36,
    height:"5'4\"", reach:63, stance:'Orthodox', weight:"Women's Strawweight", division:'WSW',
    record:'11-7-0', wins:11, losses:7, rank:null, p4p:null, color:'#a855f7',
    slpm:3.4, strAcc:42, tdAvg:1.2, tdAcc:38, subAvg:0.3,
    style:'Pressure Striker', camp:'—', streak:'W1',
    notes:'Romanian-American veteran; durable and aggressive.', last:'W' },
  viana: { id:'viana', name:'Polyana Viana', nick:'Dama de Ferro', country:'🇧🇷', age:33,
    height:"5'6\"", reach:66, stance:'Orthodox', weight:"Women's Strawweight", division:'WSW',
    record:'13-8-0', wins:13, losses:8, rank:null, p4p:null, color:'#16a34a',
    slpm:3.0, strAcc:41, tdAvg:1.4, tdAcc:40, subAvg:1.6,
    style:'BJJ Specialist', camp:'—', streak:'L1',
    notes:'Submission-heavy game; ten career wins by stoppage.', last:'L DEC' },
  gurule: { id:'gurule', name:'Luis Gurule', nick:'—', country:'🇺🇸', age:28,
    height:"5'6\"", reach:67, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'10-3-0', wins:10, losses:3, rank:null, p4p:null, color:'#eab308',
    slpm:4.0, strAcc:46, tdAvg:1.8, tdAcc:44, subAvg:0.5,
    style:'Well-Rounded', camp:'—', streak:'W2',
    notes:'Active young flyweight building UFC momentum.', last:'W DEC' },
  barez: { id:'barez', name:'Daniel Barez', nick:'El Maestro', country:'🇪🇸', age:34,
    height:"5'5\"", reach:66, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'17-7-0', wins:17, losses:7, rank:null, p4p:null, color:'#dc2626',
    slpm:3.7, strAcc:44, tdAvg:1.0, tdAcc:38, subAvg:0.7,
    style:'Veteran Technician', camp:'—', streak:'L1',
    notes:'Experienced Spanish flyweight; well-traveled.', last:'L' },
  caliari: { id:'caliari', name:'Nicolle Caliari', nick:'—', country:'🇧🇷', age:30,
    height:"5'4\"", reach:63, stance:'Orthodox', weight:"Women's Strawweight", division:'WSW',
    record:'8-4-0', wins:8, losses:4, rank:null, p4p:null, color:'#06b6d4',
    slpm:3.5, strAcc:43, tdAvg:1.3, tdAcc:40, subAvg:0.4,
    style:'Pressure Striker', camp:'—', streak:'W1',
    notes:'Brazilian prospect at 115.', last:'W' },
  bannon: { id:'bannon', name:'Shauna Bannon', nick:'—', country:'🇮🇪', age:31,
    height:"5'5\"", reach:65, stance:'Orthodox', weight:"Women's Strawweight", division:'WSW',
    record:'7-2-0', wins:7, losses:2, rank:null, p4p:null, color:'#3b82f6',
    slpm:3.8, strAcc:45, tdAvg:0.8, tdAcc:36, subAvg:0.3,
    style:'Striker', camp:'SBG Ireland', streak:'W1',
    notes:'Irish striker out of SBG.', last:'W' },

  // ─── MVP MMA 1 undercard ───
  parnasse: { id:'parnasse', name:'Salahdine Parnasse', nick:'S-Pra', country:'🇫🇷', age:28,
    height:"5'11\"", reach:73, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'22-2-0', wins:22, losses:2, rank:null, p4p:null, color:'#dc2626',
    slpm:4.3, strAcc:51, tdAvg:1.9, tdAcc:48, subAvg:1.2,
    style:'Elite Well-Rounded', camp:'MMA Factory', streak:'W3',
    notes:'Former two-division KSW champion; one of Europe\'s top prospects.', last:'W' },
  kcross: { id:'kcross', name:'Kenny Cross', nick:'—', country:'🇺🇸', age:30,
    height:"5'9\"", reach:71, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'17-4-0', wins:17, losses:4, rank:null, p4p:null, color:'#0ea5e9',
    slpm:4.0, strAcc:46, tdAvg:1.5, tdAcc:42, subAvg:0.6,
    style:'Pressure Fighter', camp:'—', streak:'W2',
    notes:'Experienced regional standout stepping up on the MVP card.', last:'W' },
  jds: { id:'jds', name:'Junior dos Santos', nick:'Cigano', country:'🇧🇷', age:42,
    height:"6'4\"", reach:77, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'21-10-0', wins:21, losses:10, rank:null, p4p:null, color:'#71717a',
    slpm:3.8, strAcc:52, tdAvg:0.3, tdAcc:40, subAvg:0.1,
    style:'Elite Boxing', camp:'—', streak:'L1',
    notes:'Former UFC Heavyweight champion; world-class boxing but well past his prime.', last:'L (2020)' },
  despaigne: { id:'despaigne', name:'Robelis Despaigne', nick:'—', country:'🇨🇺', age:36,
    height:"6'7\"", reach:84, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'5-2-0', wins:5, losses:2, rank:null, p4p:null, color:'#f59e0b',
    slpm:3.0, strAcc:50, tdAvg:0.1, tdAcc:20, subAvg:0,
    style:'Taekwondo KO Power', country2:'Cuba', camp:'—', streak:'W1',
    notes:'2012 Olympic taekwondo bronze medalist; multiple sub-20-second KOs in Karate Combat.', last:'W KO' },
  fazil: { id:'fazil', name:'Namo Fazil', nick:'—', country:'🇰🇬', age:27,
    height:"5'11\"", reach:73, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'9-1-0', wins:9, losses:1, rank:null, p4p:null, color:'#16a34a',
    slpm:4.2, strAcc:48, tdAvg:2.0, tdAcc:46, subAvg:0.7,
    style:'Pressure Wrestler', camp:'—', streak:'W4',
    notes:'Undefeated-caliber prospect with strong grappling.', last:'W' },
  babian: { id:'babian', name:'Jake Babian', nick:'—', country:'🇺🇸', age:29,
    height:"5'10\"", reach:72, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'6-1-0', wins:6, losses:1, rank:null, p4p:null, color:'#a855f7',
    slpm:3.9, strAcc:45, tdAvg:1.2, tdAcc:40, subAvg:0.4,
    style:'Aggressive Striker', camp:'—', streak:'W3',
    notes:'Young welterweight on a finishing run.', last:'W' },
  amoraes: { id:'amoraes', name:'Adriano Moraes', nick:'Mikinho', country:'🇧🇷', age:36,
    height:"5'8\"", reach:72, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'21-5-0', wins:21, losses:5, rank:null, p4p:null, color:'#dc2626',
    slpm:3.4, strAcc:47, tdAvg:2.6, tdAcc:50, subAvg:1.5,
    style:'Grappling Specialist', camp:'—', streak:'W1',
    notes:'Three-time ONE Flyweight World Champion; first to KO Demetrious Johnson.', last:'W' },
  nkuta: { id:'nkuta', name:'Phumi Nkuta', nick:'—', country:'🇿🇦', age:25,
    height:"5'6\"", reach:67, stance:'Orthodox', weight:'Catchweight 130', division:'FLW',
    record:'8-1-0', wins:8, losses:1, rank:null, p4p:null, color:'#0ea5e9',
    slpm:4.1, strAcc:47, tdAvg:1.4, tdAcc:42, subAvg:0.6,
    style:'Fast Striker', camp:'—', streak:'W4',
    notes:'Young South African prospect getting a major-stage opportunity.', last:'W' },
  jjackson: { id:'jjackson', name:'Jason Jackson', nick:'The Ass-Kicking Machine', country:'🇯🇲', age:35,
    height:"6'1\"", reach:76, stance:'Switch', weight:'Welterweight', division:'WW',
    record:'19-4-0', wins:19, losses:4, rank:null, p4p:null, color:'#eab308',
    slpm:4.0, strAcc:50, tdAvg:1.6, tdAcc:45, subAvg:0.4,
    style:'Slick Technical', camp:'Hard Knocks 365', streak:'W6',
    notes:'Former Bellator Welterweight World Champion; long unbeaten run.', last:'W' },
  creighton: { id:'creighton', name:'Jeff Creighton', nick:'—', country:'🇺🇸', age:33,
    height:"5'11\"", reach:73, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'9-3-0', wins:9, losses:3, rank:null, p4p:null, color:'#3b82f6',
    slpm:3.6, strAcc:44, tdAvg:1.0, tdAcc:38, subAvg:0.4,
    style:'Brawler', camp:'—', streak:'W1',
    notes:'Regional welterweight stepping up against elite opposition.', last:'W' },
  mgoyan: { id:'mgoyan', name:'David Mgoyan', nick:'—', country:'🇷🇺', age:28,
    height:"5'9\"", reach:71, stance:'Orthodox', weight:'Featherweight', division:'FW',
    record:'8-0-0', wins:8, losses:0, rank:null, p4p:null, color:'#16a34a',
    slpm:4.3, strAcc:49, tdAvg:1.3, tdAcc:42, subAvg:0.6,
    style:'Undefeated Prospect', camp:'—', streak:'W8',
    notes:'Unbeaten featherweight prospect on the MVP undercard.', last:'W' },
  morales: { id:'morales', name:'Albert Morales', nick:'—', country:'🇺🇸', age:34,
    height:"5'8\"", reach:69, stance:'Orthodox', weight:'Featherweight', division:'FW',
    record:'10-7-1', wins:10, losses:7, rank:null, p4p:null, color:'#f97316',
    slpm:3.8, strAcc:43, tdAvg:0.7, tdAcc:34, subAvg:0.5,
    style:'Veteran Brawler', camp:'—', streak:'L1',
    notes:'Former UFC bantamweight; experienced action fighter.', last:'L' },
  apereira: { id:'apereira', name:'Aline Pereira', nick:'Baby Poatan', country:'🇧🇷', age:35,
    height:"5'8\"", reach:69, stance:'Orthodox', weight:"Women's Flyweight", division:'WFLW',
    record:'9-2-0', wins:9, losses:2, rank:null, p4p:null, color:'#a855f7',
    slpm:4.4, strAcc:50, tdAvg:0.3, tdAcc:30, subAvg:0.1,
    style:'Kickboxer', camp:'Teixeira MMA', streak:'W3',
    notes:'Sister of Alex Pereira; decorated Glory kickboxer turned MMA.', last:'W KO' },
  massonwong: { id:'massonwong', name:'Jade Masson-Wong', nick:'—', country:'🇨🇦', age:30,
    height:"5'7\"", reach:68, stance:'Orthodox', weight:"Women's Flyweight", division:'WFLW',
    record:'6-2-0', wins:6, losses:2, rank:null, p4p:null, color:'#0ea5e9',
    slpm:3.6, strAcc:44, tdAvg:1.1, tdAcc:38, subAvg:0.3,
    style:'Striker', camp:'—', streak:'W1',
    notes:'Canadian flyweight on the MVP prelims.', last:'W' },

  // ─── SONG vs FIGUEIREDO undercard (UFC Macau) ───
  zhangmy: { id:'zhangmy', name:'Zhang Mingyang', nick:'Mountain Tiger', country:'🇨🇳', age:28,
    height:"6'2\"", reach:79, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'19-7-0', wins:19, losses:7, rank:15, p4p:null, color:'#dc2626',
    slpm:4.6, strAcc:52, tdAvg:0.3, tdAcc:30, subAvg:0.1,
    style:'Explosive KO Striker', camp:'—', streak:'W3', notes:'China\'s top LHW knockout artist.', last:'W KO1' },
  menifield: { id:'menifield', name:'Alonzo Menifield', nick:'Atomic', country:'🇺🇸', age:38,
    height:"6'0\"", reach:75, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'17-6-1', wins:17, losses:6, rank:null, p4p:null, color:'#f59e0b',
    slpm:3.3, strAcc:48, tdAvg:1.4, tdAcc:42, subAvg:0.4,
    style:'Power Wrestler', camp:'Fortis MMA', streak:'L1', notes:'Powerful veteran with fight-ending pop.', last:'L DEC' },
  pavlovich: { id:'pavlovich', name:'Sergei Pavlovich', nick:'—', country:'🇷🇺', age:33,
    height:"6'3\"", reach:84, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'20-3-0', wins:20, losses:3, rank:3, p4p:null, color:'#3b82f6',
    slpm:6.2, strAcc:55, tdAvg:0.1, tdAcc:25, subAvg:0,
    style:'Heavy-Handed Pressure', camp:'—', streak:'W1', notes:'Top-5 heavyweight with elite one-punch power.', last:'W KO1' },
  tteixeira: { id:'tteixeira', name:'Tallison Teixeira', nick:'Xicó', country:'🇧🇷', age:26,
    height:"6'7\"", reach:84, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'9-1-0', wins:9, losses:1, rank:13, p4p:null, color:'#16a34a',
    slpm:5.0, strAcc:53, tdAvg:0.4, tdAcc:35, subAvg:0.2,
    style:'Towering Finisher', camp:'—', streak:'L1', notes:'Massive heavyweight prospect, eight first-round wins.', last:'L KO1' },
  aperez: { id:'aperez', name:'Alex Perez', nick:'—', country:'🇺🇸', age:34,
    height:"5'6\"", reach:68, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'25-8-0', wins:25, losses:8, rank:10, p4p:null, color:'#a855f7',
    slpm:3.4, strAcc:46, tdAvg:2.2, tdAcc:44, subAvg:0.5,
    style:'Wrestle-Boxing', camp:'—', streak:'W1', notes:'Ranked flyweight, former title challenger.', last:'W DEC' },
  sumudaerji: { id:'sumudaerji', name:'Su Mudaerji', nick:'The Tibetan Eagle', country:'🇨🇳', age:28,
    height:"5'9\"", reach:74, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'16-5-0', wins:16, losses:5, rank:null, p4p:null, color:'#0ea5e9',
    slpm:4.2, strAcc:48, tdAvg:0.6, tdAcc:35, subAvg:0.4,
    style:'Rangy Striker', camp:'—', streak:'W2', notes:'Long, fast Chinese flyweight with KO ability.', last:'W KO2' },
  asakura: { id:'asakura', name:'Kai Asakura', nick:'—', country:'🇯🇵', age:32,
    height:"5'7\"", reach:68, stance:'Orthodox', weight:'Bantamweight', division:'BW',
    record:'21-6-0', wins:21, losses:6, rank:null, p4p:null, color:'#eab308',
    slpm:4.5, strAcc:49, tdAvg:0.5, tdAcc:34, subAvg:0.2,
    style:'Explosive Striker', camp:'—', streak:'L1', notes:'Former RIZIN champion; dynamic finishing power.', last:'L SUB1' },
  smotherman: { id:'smotherman', name:'Cameron Smotherman', nick:'—', country:'🇺🇸', age:29,
    height:"5'10\"", reach:72, stance:'Orthodox', weight:'Bantamweight', division:'BW',
    record:'13-3-0', wins:13, losses:3, rank:null, p4p:null, color:'#f97316',
    slpm:4.0, strAcc:46, tdAvg:1.0, tdAcc:38, subAvg:0.3,
    style:'Pressure Striker', camp:'—', streak:'W1', notes:'Aggressive bantamweight prospect.', last:'W DEC' },
  salikhov: { id:'salikhov', name:'Muslim Salikhov', nick:'King of Kung Fu', country:'🇷🇺', age:41,
    height:"5'10\"", reach:75, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'21-5-0', wins:21, losses:5, rank:null, p4p:null, color:'#dc2626',
    slpm:3.8, strAcc:52, tdAvg:0.3, tdAcc:33, subAvg:0.1,
    style:'Wushu Striker', camp:'—', streak:'W1', notes:'Spinning-strike specialist, dangerous veteran.', last:'W KO' },
  jmatthews: { id:'jmatthews', name:'Jake Matthews', nick:'Celtic Kid', country:'🇦🇺', age:31,
    height:"5'11\"", reach:74, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'20-7-0', wins:20, losses:7, rank:null, p4p:null, color:'#16a34a',
    slpm:3.6, strAcc:47, tdAvg:1.8, tdAcc:46, subAvg:0.5,
    style:'Well-Rounded', camp:'—', streak:'W2', notes:'Long-tenured Australian welterweight.', last:'W DEC' },
  haddon: { id:'haddon', name:'Cody Haddon', nick:'—', country:'🇦🇺', age:26,
    height:"5'8\"", reach:69, stance:'Orthodox', weight:'Bantamweight', division:'BW',
    record:'9-1-0', wins:9, losses:1, rank:null, p4p:null, color:'#3b82f6',
    slpm:4.3, strAcc:48, tdAvg:1.6, tdAcc:42, subAvg:0.6,
    style:'Finisher', camp:'—', streak:'W2', notes:'Undefeated-caliber bantamweight prospect.', last:'W' },
  aoriqileng: { id:'aoriqileng', name:'Aoriqileng', nick:'The Mongolian Murderer', country:'🇨🇳', age:30,
    height:"5'6\"", reach:67, stance:'Orthodox', weight:'Bantamweight', division:'BW',
    record:'25-11-0', wins:25, losses:11, rank:null, p4p:null, color:'#a855f7',
    slpm:4.4, strAcc:46, tdAvg:1.1, tdAcc:38, subAvg:0.3,
    style:'Volume Brawler', camp:'—', streak:'W1', notes:'High-volume Chinese bantamweight.', last:'W DEC' },
  xiong: { id:'xiong', name:'Xiong Jingnan', nick:'The Panda', country:'🇨🇳', age:38,
    height:"5'5\"", reach:64, stance:'Orthodox', weight:"Women's Strawweight", division:'WSW',
    record:'17-4-0', wins:17, losses:4, rank:null, p4p:null, color:'#eab308',
    slpm:4.6, strAcc:48, tdAvg:0.4, tdAcc:30, subAvg:0.1,
    style:'Aggressive Striker', camp:'—', streak:'W1', notes:'Former ONE strawweight world champion.', last:'W KO' },
  ahill: { id:'ahill', name:'Angela Hill', nick:'Overkill', country:'🇺🇸', age:41,
    height:"5'4\"", reach:64, stance:'Orthodox', weight:"Women's Strawweight", division:'WSW',
    record:'18-15-0', wins:18, losses:15, rank:14, p4p:null, color:'#f97316',
    slpm:4.3, strAcc:42, tdAvg:0.6, tdAcc:34, subAvg:0.1,
    style:'High-Volume Kickboxer', camp:'—', streak:'L1', notes:'Ranked veteran with elite cardio and output.', last:'L DEC' },
  tsuruya: { id:'tsuruya', name:'Rei Tsuruya', nick:'—', country:'🇯🇵', age:24,
    height:"5'6\"", reach:67, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'10-1-0', wins:10, losses:1, rank:null, p4p:null, color:'#0ea5e9',
    slpm:4.0, strAcc:47, tdAvg:2.4, tdAcc:48, subAvg:0.7,
    style:'Young Finisher', camp:'—', streak:'W3', notes:'Undefeated-in-UFC Japanese flyweight prospect.', last:'W SUB' },
  jaguilar: { id:'jaguilar', name:'Jesus Aguilar', nick:'—', country:'🇲🇽', age:28,
    height:"5'6\"", reach:66, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'11-3-0', wins:11, losses:3, rank:null, p4p:null, color:'#dc2626',
    slpm:3.9, strAcc:45, tdAvg:1.0, tdAcc:38, subAvg:0.4,
    style:'Boxer', camp:'—', streak:'W1', notes:'Mexican flyweight with crisp hands.', last:'W DEC' },
  loma: { id:'loma', name:'Loma Lookboonmee', nick:'—', country:'🇹🇭', age:30,
    height:"5'2\"", reach:63, stance:'Orthodox', weight:"Women's Strawweight", division:'WSW',
    record:'10-4-0', wins:10, losses:4, rank:null, p4p:null, color:'#16a34a',
    slpm:3.9, strAcc:46, tdAvg:1.9, tdAcc:44, subAvg:0.3,
    style:'Muay Thai + Wrestling', camp:'—', streak:'W1', notes:'Thailand\'s first UFC fighter; clinch specialist.', last:'W DEC' },
  jamorim: { id:'jamorim', name:'Jaqueline Amorim', nick:'—', country:'🇧🇷', age:31,
    height:"5'4\"", reach:65, stance:'Orthodox', weight:"Women's Strawweight", division:'WSW',
    record:'9-2-0', wins:9, losses:2, rank:null, p4p:null, color:'#a855f7',
    slpm:3.0, strAcc:42, tdAvg:2.6, tdAcc:48, subAvg:1.4,
    style:'BJJ Specialist', camp:'—', streak:'W2', notes:'Aggressive grappler hunting submissions.', last:'W SUB' },
  zhukj: { id:'zhukj', name:'Zhu Kangjie', nick:'—', country:'🇨🇳', age:28,
    height:"5'8\"", reach:70, stance:'Orthodox', weight:'Featherweight', division:'FW',
    record:'13-3-0', wins:13, losses:3, rank:null, p4p:null, color:'#eab308',
    slpm:4.1, strAcc:47, tdAvg:1.3, tdAcc:40, subAvg:0.4,
    style:'Well-Rounded', camp:'—', streak:'W2', notes:'Road to UFC featherweight tournament winner.', last:'W' },
  rtaveras: { id:'rtaveras', name:'Ramon Taveras', nick:'—', country:'🇺🇸', age:32,
    height:"5'7\"", reach:69, stance:'Orthodox', weight:'Featherweight', division:'FW',
    record:'9-3-0', wins:9, losses:3, rank:null, p4p:null, color:'#f97316',
    slpm:3.9, strAcc:45, tdAvg:0.8, tdAcc:36, subAvg:0.3,
    style:'Boxer', camp:'—', streak:'L1', notes:'American featherweight, technical boxing base.', last:'L DEC' },
  dingm: { id:'dingm', name:'Ding Meng', nick:'—', country:'🇨🇳', age:27,
    height:"5'10\"", reach:72, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'8-3-0', wins:8, losses:3, rank:null, p4p:null, color:'#3b82f6',
    slpm:3.7, strAcc:44, tdAvg:1.2, tdAcc:38, subAvg:0.3,
    style:'Pressure Fighter', camp:'—', streak:'W1', notes:'Chinese welterweight prospect.', last:'W' },
  jhsouza: { id:'jhsouza', name:'Jose Henrique Souza', nick:'—', country:'🇧🇷', age:29,
    height:"5'11\"", reach:73, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'10-3-0', wins:10, losses:3, rank:null, p4p:null, color:'#dc2626',
    slpm:3.8, strAcc:45, tdAvg:1.4, tdAcc:40, subAvg:0.5,
    style:'Brawler', camp:'—', streak:'W2', notes:'Brazilian welterweight on the early prelims.', last:'W' },
  lfdias: { id:'lfdias', name:'Luis Felipe Dias', nick:'—', country:'🇧🇷', age:28,
    height:"6'0\"", reach:74, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'10-2-0', wins:10, losses:2, rank:null, p4p:null, color:'#16a34a',
    slpm:4.0, strAcc:46, tdAvg:1.0, tdAcc:38, subAvg:0.4,
    style:'Power Striker', camp:'—', streak:'W3', notes:'Brazilian middleweight prospect.', last:'W KO' },
  yslee: { id:'yslee', name:'Yi Sak Lee', nick:'—', country:'🇰🇷', age:29,
    height:"5'11\"", reach:73, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'9-2-0', wins:9, losses:2, rank:null, p4p:null, color:'#a855f7',
    slpm:3.8, strAcc:45, tdAvg:1.3, tdAcc:40, subAvg:0.5,
    style:'Well-Rounded', camp:'—', streak:'W2', notes:'Korean middleweight making his UFC run.', last:'W' },

  // ─── MUHAMMAD vs BONFIM undercard (UFC Vegas 118) ───
  ballen: { id:'ballen', name:'Brendan Allen', nick:'All In', country:'🇺🇸', age:30,
    height:"6'2\"", reach:75, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'26-7-0', wins:26, losses:7, rank:7, p4p:null, color:'#dc2626',
    slpm:4.0, strAcc:51, tdAvg:2.3, tdAcc:44, subAvg:1.6,
    style:'Grappling + Volume', camp:'Sanford MMA', streak:'W1', notes:'Top-10 middleweight, elite submission rate.', last:'W SUB' },
  shahbazyan: { id:'shahbazyan', name:'Edmen Shahbazyan', nick:'The Golden Boy', country:'🇺🇸', age:28,
    height:"6'2\"", reach:77, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'16-5-0', wins:16, losses:5, rank:null, p4p:null, color:'#f59e0b',
    slpm:4.2, strAcc:50, tdAvg:1.2, tdAcc:40, subAvg:0.5,
    style:'Athletic KO Striker', camp:'—', streak:'W3', notes:'Dangerous finisher on a three-fight streak.', last:'W KO' },
  brunosilva: { id:'brunosilva', name:'Bruno Silva', nick:'Bulldog', country:'🇧🇷', age:34,
    height:"5'6\"", reach:67, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'15-8-2', wins:15, losses:8, rank:16, p4p:null, color:'#3b82f6',
    slpm:5.0, strAcc:47, tdAvg:0.5, tdAcc:32, subAvg:0.2,
    style:'Volume Pressure', camp:'—', streak:'L1', notes:'Ranked flyweight known for relentless output.', last:'L DEC' },
  chairez: { id:'chairez', name:'Edgar Chairez', nick:'—', country:'🇲🇽', age:28,
    height:"5'5\"", reach:66, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'13-6-0', wins:13, losses:6, rank:null, p4p:null, color:'#16a34a',
    slpm:3.6, strAcc:44, tdAvg:2.0, tdAcc:44, subAvg:1.1,
    style:'Grappler', camp:'—', streak:'W1', notes:'Mexican flyweight with a strong submission game.', last:'W SUB' },
  baraniewski: { id:'baraniewski', name:'Iwo Baraniewski', nick:'—', country:'🇵🇱', age:25,
    height:"6'4\"", reach:79, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'8-0-0', wins:8, losses:0, rank:null, p4p:null, color:'#a855f7',
    slpm:4.4, strAcc:49, tdAvg:1.0, tdAcc:40, subAvg:0.6,
    style:'Undefeated Finisher', camp:'—', streak:'W8', notes:'Unbeaten Polish light heavyweight prospect.', last:'W' },
  elekana: { id:'elekana', name:'Billy Elekana', nick:'—', country:'🇺🇸', age:30,
    height:"6'2\"", reach:77, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'10-2-0', wins:10, losses:2, rank:null, p4p:null, color:'#eab308',
    slpm:4.0, strAcc:46, tdAvg:1.2, tdAcc:38, subAvg:0.4,
    style:'Power Striker', camp:'—', streak:'W2', notes:'Hard-hitting light heavyweight on the rise.', last:'W KO' },
  ziam: { id:'ziam', name:'Fares Ziam', nick:'Smile Killer', country:'🇫🇷', age:28,
    height:"6'1\"", reach:76, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'18-4-0', wins:18, losses:4, rank:14, p4p:null, color:'#dc2626',
    slpm:3.6, strAcc:50, tdAvg:1.0, tdAcc:42, subAvg:0.3,
    style:'Rangy Counter-Striker', camp:'—', streak:'W5', notes:'Ranked lightweight on a long win streak.', last:'W DEC' },
  tnolan: { id:'tnolan', name:'Tom Nolan', nick:'Big Train', country:'🇦🇺', age:25,
    height:"6'3\"", reach:76, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'10-1-0', wins:10, losses:1, rank:null, p4p:null, color:'#3b82f6',
    slpm:4.5, strAcc:50, tdAvg:1.4, tdAcc:42, subAvg:0.5,
    style:'Tall Finisher', camp:'—', streak:'W3', notes:'Long Australian lightweight prospect.', last:'W KO' },
  bmitchell: { id:'bmitchell', name:'Bryce Mitchell', nick:'Thug Nasty', country:'🇺🇸', age:31,
    height:"5'8\"", reach:70, stance:'Southpaw', weight:'Bantamweight', division:'BW',
    record:'18-3-0', wins:18, losses:3, rank:null, p4p:null, color:'#16a34a',
    slpm:3.0, strAcc:43, tdAvg:3.4, tdAcc:50, subAvg:1.5,
    style:'Wrestle-Grappler', camp:'—', streak:'L1', notes:'Grappling-heavy fighter moving to bantamweight.', last:'L SUB' },
  vhenry: { id:'vhenry', name:'Victor Henry', nick:'—', country:'🇺🇸', age:38,
    height:"5'7\"", reach:67, stance:'Orthodox', weight:'Bantamweight', division:'BW',
    record:'25-7-0', wins:25, losses:7, rank:null, p4p:null, color:'#a855f7',
    slpm:4.8, strAcc:47, tdAvg:0.9, tdAcc:38, subAvg:0.4,
    style:'High-Volume Veteran', camp:'—', streak:'W1', notes:'Experienced bantamweight with heavy output.', last:'W DEC' },
  irodriguez: { id:'irodriguez', name:'Imanol Rodriguez', nick:'—', country:'🇲🇽', age:27,
    height:"5'7\"", reach:69, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'7-0-0', wins:7, losses:0, rank:null, p4p:null, color:'#eab308',
    slpm:4.0, strAcc:47, tdAvg:1.4, tdAcc:42, subAvg:0.6,
    style:'Undefeated Prospect', camp:'—', streak:'W7', notes:'Unbeaten Mexican flyweight debutant.', last:'W' },
  schnell: { id:'schnell', name:'Matt Schnell', nick:'Danger', country:'🇺🇸', age:36,
    height:"5'7\"", reach:69, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'17-10-0', wins:17, losses:10, rank:null, p4p:null, color:'#f97316',
    slpm:3.8, strAcc:44, tdAvg:1.0, tdAcc:36, subAvg:0.7,
    style:'Scrappy Veteran', camp:'—', streak:'L1', notes:'Durable flyweight veteran with submission threat.', last:'L' },
  mcghee: { id:'mcghee', name:'Marcus McGhee', nick:'—', country:'🇺🇸', age:32,
    height:"5'7\"", reach:68, stance:'Orthodox', weight:'Bantamweight', division:'BW',
    record:'10-2-0', wins:10, losses:2, rank:null, p4p:null, color:'#dc2626',
    slpm:4.4, strAcc:49, tdAvg:1.1, tdAcc:40, subAvg:0.6,
    style:'Aggressive Finisher', camp:'—', streak:'W4', notes:'Undefeated-in-UFC bantamweight prospect.', last:'W KO' },
  wiklacz: { id:'wiklacz', name:'Jakub Wiklacz', nick:'—', country:'🇵🇱', age:29,
    height:"5'7\"", reach:68, stance:'Orthodox', weight:'Bantamweight', division:'BW',
    record:'18-3-2', wins:18, losses:3, rank:null, p4p:null, color:'#3b82f6',
    slpm:3.7, strAcc:45, tdAvg:1.8, tdAcc:44, subAvg:0.5,
    style:'Grinder', camp:'—', streak:'W1', notes:'Polish bantamweight with a deep record.', last:'W DEC' },
  leavitt: { id:'leavitt', name:'Jordan Leavitt', nick:'The Monkey King', country:'🇺🇸', age:30,
    height:"5'9\"", reach:72, stance:'Southpaw', weight:'Lightweight', division:'LW',
    record:'13-3-0', wins:13, losses:3, rank:null, p4p:null, color:'#16a34a',
    slpm:2.6, strAcc:44, tdAvg:3.8, tdAcc:52, subAvg:1.3,
    style:'Wrestle-Grappler', camp:'Syndicate MMA', streak:'W1', notes:'Takedown-heavy lightweight with slick top game.', last:'W SUB' },
  jbrito: { id:'jbrito', name:'Joanderson Brito', nick:'Tubarão', country:'🇧🇷', age:31,
    height:"5'8\"", reach:71, stance:'Orthodox', weight:'Featherweight', division:'FW',
    record:'18-5-1', wins:18, losses:5, rank:null, p4p:null, color:'#a855f7',
    slpm:4.7, strAcc:48, tdAvg:1.6, tdAcc:42, subAvg:0.8,
    style:'Pressure Finisher', camp:'—', streak:'W4', notes:'Aggressive Brazilian known for fast finishes.', last:'W KO' },
  ksouza: { id:'ksouza', name:'Ketlen Souza', nick:'—', country:'🇧🇷', age:32,
    height:"5'5\"", reach:65, stance:'Orthodox', weight:"Women's Strawweight", division:'WSW',
    record:'16-6-0', wins:16, losses:6, rank:null, p4p:null, color:'#eab308',
    slpm:3.6, strAcc:44, tdAvg:1.4, tdAcc:40, subAvg:0.6,
    style:'Well-Rounded', camp:'—', streak:'W2', notes:'Experienced Brazilian strawweight.', last:'W DEC' },
  carnelossi: { id:'carnelossi', name:'Ariane Carnelossi', nick:'Sorriso', country:'🇧🇷', age:35,
    height:"5'3\"", reach:62, stance:'Orthodox', weight:"Women's Strawweight", division:'WSW',
    record:'15-4-0', wins:15, losses:4, rank:null, p4p:null, color:'#f97316',
    slpm:3.9, strAcc:45, tdAvg:1.7, tdAcc:42, subAvg:0.5,
    style:'Pressure Brawler', camp:'—', streak:'W1', notes:'Relentless Brazilian strawweight.', last:'W' },
  cachoeira: { id:'cachoeira', name:'Priscila Cachoeira', nick:'Zombie Girl', country:'🇧🇷', age:37,
    height:"5'6\"", reach:67, stance:'Orthodox', weight:"Women's Flyweight", division:'WFLW',
    record:'13-8-0', wins:13, losses:8, rank:null, p4p:null, color:'#dc2626',
    slpm:4.4, strAcc:43, tdAvg:0.5, tdAcc:30, subAvg:0.2,
    style:'Aggressive Striker', camp:'—', streak:'L1', notes:'Heavy-handed, durable flyweight.', last:'L' },
  cchandler: { id:'cchandler', name:'Chelsea Chandler', nick:'Cersei', country:'🇺🇸', age:30,
    height:"5'7\"", reach:69, stance:'Orthodox', weight:"Women's Flyweight", division:'WFLW',
    record:'6-4-0', wins:6, losses:4, rank:null, p4p:null, color:'#3b82f6',
    slpm:3.7, strAcc:44, tdAvg:1.1, tdAcc:38, subAvg:0.4,
    style:'Pressure Fighter', camp:'—', streak:'L1', notes:'Aggressive American flyweight.', last:'L' },
  jchaves: { id:'jchaves', name:'Jeisla Chaves', nick:'—', country:'🇧🇷', age:29,
    height:"5'4\"", reach:65, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'6-0-0', wins:6, losses:0, rank:null, p4p:null, color:'#16a34a',
    slpm:3.9, strAcc:46, tdAvg:1.5, tdAcc:42, subAvg:0.7,
    style:'Undefeated Prospect', camp:'—', streak:'W6', notes:'Unbeaten Brazilian women\'s flyweight.', last:'W' },
  duben: { id:'duben', name:'Yuneisy Duben', nick:'—', country:'🇨🇺', age:30,
    height:"5'5\"", reach:66, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'6-1-0', wins:6, losses:1, rank:null, p4p:null, color:'#a855f7',
    slpm:3.7, strAcc:45, tdAvg:1.2, tdAcc:40, subAvg:0.5,
    style:'Striker', camp:'—', streak:'W2', notes:'Cuban women\'s flyweight debutant.', last:'W' },

  // ─── FREEDOM 250 undercard (UFC White House) ───
  nickal: { id:'nickal', name:'Bo Nickal', nick:'—', country:'🇺🇸', age:29,
    height:"6'1\"", reach:75, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'8-1-0', wins:8, losses:1, rank:null, p4p:null, color:'#dc2626',
    slpm:3.4, strAcc:50, tdAvg:4.0, tdAcc:55, subAvg:1.8,
    style:'Elite Wrestler', camp:'—', streak:'L1', notes:'Three-time NCAA champion wrestler with title aspirations.', last:'L DEC' },
  daukaus: { id:'daukaus', name:'Kyle Daukaus', nick:'—', country:'🇺🇸', age:32,
    height:"6'2\"", reach:75, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'13-4-0', wins:13, losses:4, rank:null, p4p:null, color:'#3b82f6',
    slpm:3.5, strAcc:46, tdAvg:2.2, tdAcc:44, subAvg:1.2,
    style:'Grappler', camp:'—', streak:'W1', notes:'Submission-savvy middleweight.', last:'W SUB' },
  ruffy: { id:'ruffy', name:'Mauricio Ruffy', nick:'—', country:'🇧🇷', age:29,
    height:"5'11\"", reach:74, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'12-1-0', wins:12, losses:1, rank:null, p4p:null, color:'#16a34a',
    slpm:4.8, strAcc:52, tdAvg:0.4, tdAcc:33, subAvg:0.2,
    style:'Explosive Striker', camp:'Fighting Nerds', streak:'W2', notes:'Flashy Brazilian striker with viral KO power.', last:'W KO' },
  chandler: { id:'chandler', name:'Michael Chandler', nick:'Iron', country:'🇺🇸', age:40,
    height:"5'8\"", reach:71, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'24-10-0', wins:24, losses:10, rank:null, p4p:null, color:'#eab308',
    slpm:4.5, strAcc:44, tdAvg:2.6, tdAcc:42, subAvg:0.5,
    style:'Explosive Wrestle-Boxer', camp:'Kill Cliff FC', streak:'L1', notes:'Former Bellator champion, all-action veteran.', last:'L DEC' },
  dlopes: { id:'dlopes', name:'Diego Lopes', nick:'—', country:'🇧🇷', age:31,
    height:"5'9\"", reach:73, stance:'Orthodox', weight:'Featherweight', division:'FW',
    record:'27-7-0', wins:27, losses:7, rank:3, p4p:null, color:'#a855f7',
    slpm:5.0, strAcc:49, tdAvg:1.4, tdAcc:42, subAvg:1.4,
    style:'Chaos Finisher', camp:'—', streak:'L1', notes:'Top-5 featherweight, dangerous everywhere.', last:'L DEC' },
  sgarcia: { id:'sgarcia', name:'Steve Garcia', nick:'Mean Machine', country:'🇺🇸', age:33,
    height:"5'10\"", reach:73, stance:'Orthodox', weight:'Featherweight', division:'FW',
    record:'18-5-0', wins:18, losses:5, rank:13, p4p:null, color:'#f97316',
    slpm:5.4, strAcc:53, tdAvg:0.6, tdAcc:35, subAvg:0.3,
    style:'KO Striker', camp:'—', streak:'W7', notes:'Ranked featherweight on a long finishing streak.', last:'W KO' },
  dlewis: { id:'dlewis', name:'Derrick Lewis', nick:'The Black Beast', country:'🇺🇸', age:41,
    height:"6'3\"", reach:79, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'29-12-0', wins:29, losses:12, rank:null, p4p:null, color:'#dc2626',
    slpm:2.9, strAcc:48, tdAvg:0.3, tdAcc:30, subAvg:0.1,
    style:'One-Shot KO Power', camp:'—', streak:'W2', notes:'UFC\'s all-time knockout leader; legendary power.', last:'W KO' },
  hokit: { id:'hokit', name:'Josh Hokit', nick:'—', country:'🇺🇸', age:29,
    height:"6'1\"", reach:75, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'7-1-0', wins:7, losses:1, rank:null, p4p:null, color:'#3b82f6',
    slpm:3.6, strAcc:46, tdAvg:2.4, tdAcc:46, subAvg:0.5,
    style:'Athletic Wrestler', camp:'—', streak:'W3', notes:'Former NFL athlete turned heavyweight prospect.', last:'W' },

  // ─── KAPE vs HORIGUCHI undercard (UFC Vegas 119) ───
  cutelaba: { id:'cutelaba', name:'Ion Cutelaba', nick:'The Hulk', country:'🇲🇩', age:32,
    height:"6'0\"", reach:75, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'20-11-1', wins:20, losses:11, rank:null, p4p:null, color:'#dc2626',
    slpm:3.7, strAcc:45, tdAvg:2.2, tdAcc:42, subAvg:0.4,
    style:'Explosive Brawler', camp:'—', streak:'L1', notes:'High-energy Moldovan with fast-twitch power.', last:'L' },
  stirling: { id:'stirling', name:'Navajo Stirling', nick:'—', country:'🇳🇿', age:27,
    height:"6'4\"", reach:80, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'9-0-0', wins:9, losses:0, rank:null, p4p:null, color:'#3b82f6',
    slpm:4.2, strAcc:50, tdAvg:1.5, tdAcc:44, subAvg:0.7,
    style:'Undefeated Prospect', camp:'City Kickboxing', streak:'W9', notes:'Unbeaten City Kickboxing light heavyweight.', last:'W' },
  krosa: { id:'krosa', name:'Karol Rosa', nick:'—', country:'🇧🇷', age:31,
    height:"5'7\"", reach:69, stance:'Orthodox', weight:"Women's Bantamweight", division:'WBW',
    record:'19-7-0', wins:19, losses:7, rank:null, p4p:null, color:'#16a34a',
    slpm:5.0, strAcc:46, tdAvg:1.0, tdAcc:38, subAvg:0.2,
    style:'High-Volume Striker', camp:'—', streak:'W1', notes:'Heavy-output Brazilian bantamweight.', last:'W DEC' },
  lsantos: { id:'lsantos', name:'Luana Santos', nick:'Dread', country:'🇧🇷', age:25,
    height:"5'7\"", reach:69, stance:'Orthodox', weight:"Women's Bantamweight", division:'WBW',
    record:'10-2-0', wins:10, losses:2, rank:null, p4p:null, color:'#a855f7',
    slpm:3.2, strAcc:44, tdAvg:2.6, tdAcc:46, subAvg:1.0,
    style:'Young Grappler', camp:'—', streak:'W1', notes:'Rising Brazilian grappler.', last:'W' },
  hamil: { id:'hamil', name:'Hyder Amil', nick:'—', country:'🇺🇸', age:31,
    height:"5'7\"", reach:70, stance:'Orthodox', weight:'Featherweight', division:'FW',
    record:'11-2-0', wins:11, losses:2, rank:null, p4p:null, color:'#eab308',
    slpm:5.2, strAcc:50, tdAvg:0.4, tdAcc:33, subAvg:0.2,
    style:'KO Striker', camp:'—', streak:'W2', notes:'Explosive featherweight finisher.', last:'W KO' },
  crodriguez: { id:'crodriguez', name:'Christian Rodriguez', nick:'CeeRod', country:'🇺🇸', age:27,
    height:"5'9\"", reach:72, stance:'Orthodox', weight:'Featherweight', division:'FW',
    record:'12-4-0', wins:12, losses:4, rank:null, p4p:null, color:'#f97316',
    slpm:3.8, strAcc:47, tdAvg:1.8, tdAcc:44, subAvg:0.4,
    style:'Well-Rounded', camp:'—', streak:'W1', notes:'Balanced young featherweight.', last:'W DEC' },
  diniz: { id:'diniz', name:'Jhonata Diniz', nick:'—', country:'🇧🇷', age:31,
    height:"6'5\"", reach:81, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'9-2-0', wins:9, losses:2, rank:null, p4p:null, color:'#dc2626',
    slpm:3.8, strAcc:48, tdAvg:0.3, tdAcc:30, subAvg:0.1,
    style:'Kickboxer', camp:'—', streak:'W1', notes:'Tall Brazilian heavyweight striker.', last:'W' },
  joseluiz: { id:'joseluiz', name:'Jose Luiz', nick:'—', country:'🇧🇷', age:30,
    height:"6'3\"", reach:78, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'6-1-0', wins:6, losses:1, rank:null, p4p:null, color:'#3b82f6',
    slpm:3.5, strAcc:46, tdAvg:0.6, tdAcc:33, subAvg:0.3,
    style:'Power Striker', camp:'—', streak:'W2', notes:'Brazilian heavyweight prospect.', last:'W KO' },
  alima: { id:'alima', name:'Andre Lima', nick:'—', country:'🇧🇷', age:26,
    height:"5'7\"", reach:68, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'11-0-0', wins:11, losses:0, rank:null, p4p:null, color:'#16a34a',
    slpm:4.4, strAcc:49, tdAvg:1.6, tdAcc:42, subAvg:0.6,
    style:'Undefeated Finisher', camp:'—', streak:'W11', notes:'Unbeaten Brazilian flyweight prospect.', last:'W' },
  kborjas: { id:'kborjas', name:'Kevin Borjas', nick:'—', country:'🇵🇪', age:29,
    height:"5'6\"", reach:67, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'10-5-0', wins:10, losses:5, rank:null, p4p:null, color:'#a855f7',
    slpm:3.7, strAcc:45, tdAvg:1.3, tdAcc:40, subAvg:0.4,
    style:'Striker', camp:'—', streak:'L1', notes:'Peruvian flyweight.', last:'L' },
  mesquita: { id:'mesquita', name:'Beatriz Mesquita', nick:'Bia', country:'🇧🇷', age:32,
    height:"5'6\"", reach:67, stance:'Orthodox', weight:"Women's Bantamweight", division:'WBW',
    record:'7-0-0', wins:7, losses:0, rank:null, p4p:null, color:'#eab308',
    slpm:2.8, strAcc:43, tdAvg:3.0, tdAcc:48, subAvg:1.6,
    style:'Elite Grappler', camp:'—', streak:'W7', notes:'Decorated BJJ champion, unbeaten in MMA.', last:'W SUB' },
  mullins: { id:'mullins', name:'Melissa Mullins', nick:'—', country:'🇺🇸', age:31,
    height:"5'6\"", reach:67, stance:'Orthodox', weight:"Women's Bantamweight", division:'WBW',
    record:'6-1-0', wins:6, losses:1, rank:null, p4p:null, color:'#f97316',
    slpm:3.6, strAcc:44, tdAvg:1.4, tdAcc:40, subAvg:0.5,
    style:'Pressure Fighter', camp:'—', streak:'W1', notes:'American bantamweight prospect.', last:'W' },
  raposo: { id:'raposo', name:'Mitch Raposo', nick:'—', country:'🇺🇸', age:27,
    height:"5'6\"", reach:67, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'10-2-0', wins:10, losses:2, rank:null, p4p:null, color:'#dc2626',
    slpm:4.0, strAcc:46, tdAvg:1.7, tdAcc:42, subAvg:0.5,
    style:'Well-Rounded', camp:'—', streak:'W1', notes:'American flyweight prospect.', last:'W DEC' },
  anascimento: { id:'anascimento', name:'Allan Nascimento', nick:'Puro Osso', country:'🇧🇷', age:34,
    height:"5'6\"", reach:68, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'21-7-0', wins:21, losses:7, rank:null, p4p:null, color:'#3b82f6',
    slpm:3.4, strAcc:45, tdAvg:2.4, tdAcc:44, subAvg:0.8,
    style:'Grappler', camp:'—', streak:'W1', notes:'Experienced Brazilian flyweight grappler.', last:'W DEC' },

  // ─── FIZIEV vs TORRES undercard (UFC Baku) ───
  sharamg: { id:'sharamg', name:'Sharabutdin Magomedov', nick:'Bullet', country:'🇷🇺', age:31,
    height:"6'2\"", reach:77, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'16-1-0', wins:16, losses:1, rank:null, p4p:null, color:'#dc2626',
    slpm:4.8, strAcc:54, tdAvg:0.3, tdAcc:33, subAvg:0.1,
    style:'Elite Striker', camp:'—', streak:'W1', notes:'Dagestani striking specialist with flashy KO power.', last:'W DEC' },
  michelp: { id:'michelp', name:'Michel Pereira', nick:'Demolidor', country:'🇧🇷', age:32,
    height:"6'1\"", reach:75, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'32-14-0', wins:32, losses:14, rank:null, p4p:null, color:'#16a34a',
    slpm:4.5, strAcc:50, tdAvg:1.6, tdAcc:42, subAvg:0.5,
    style:'Acrobatic Chaos', camp:'—', streak:'W1', notes:'Unpredictable Brazilian known for highlight-reel offense.', last:'W DEC' },
  vettori: { id:'vettori', name:'Marvin Vettori', nick:'The Italian Dream', country:'🇮🇹', age:32,
    height:"6'0\"", reach:74, stance:'Southpaw', weight:'Middleweight', division:'MW',
    record:'19-7-1', wins:19, losses:7, rank:null, p4p:null, color:'#3b82f6',
    slpm:4.4, strAcc:47, tdAvg:2.0, tdAcc:42, subAvg:0.3,
    style:'Pressure Volume', camp:'Kill Cliff FC', streak:'L1', notes:'Durable, high-pace Italian middleweight.', last:'L DEC' },
  naurdiev: { id:'naurdiev', name:'Ismail Naurdiev', nick:'The Austrian Wonderboy', country:'🇦🇹', age:29,
    height:"6'0\"", reach:75, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'24-6-0', wins:24, losses:6, rank:null, p4p:null, color:'#a855f7',
    slpm:3.9, strAcc:48, tdAvg:1.4, tdAcc:40, subAvg:0.5,
    style:'Well-Rounded', camp:'—', streak:'W2', notes:'Experienced Austrian middleweight.', last:'W DEC' },
  bferreira: { id:'bferreira', name:'Brunno Ferreira', nick:'The Hulk', country:'🇧🇷', age:31,
    height:"5'11\"", reach:73, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'13-2-0', wins:13, losses:2, rank:null, p4p:null, color:'#eab308',
    slpm:4.2, strAcc:49, tdAvg:1.0, tdAcc:40, subAvg:0.9,
    style:'Power Finisher', camp:'—', streak:'W1', notes:'Hard-hitting Brazilian middleweight.', last:'W KO' },
  aliskerov: { id:'aliskerov', name:'Ikram Aliskerov', nick:'—', country:'🇷🇺', age:33,
    height:"6'0\"", reach:75, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'17-2-0', wins:17, losses:2, rank:null, p4p:null, color:'#f97316',
    slpm:4.0, strAcc:50, tdAvg:3.0, tdAcc:48, subAvg:1.0,
    style:'Wrestle-Striker', camp:'—', streak:'W1', notes:'Powerful Dagestani middleweight with KO power.', last:'W KO' },
  almabayev: { id:'almabayev', name:'Asu Almabayev', nick:'—', country:'🇰🇿', age:31,
    height:"5'6\"", reach:66, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'21-3-0', wins:21, losses:3, rank:null, p4p:null, color:'#dc2626',
    slpm:3.6, strAcc:47, tdAvg:3.6, tdAcc:50, subAvg:0.9,
    style:'Relentless Wrestler', camp:'—', streak:'W2', notes:'High-pace Kazakh flyweight grappler.', last:'W DEC' },
  cjohnson: { id:'cjohnson', name:'Charles Johnson', nick:'Air', country:'🇺🇸', age:34,
    height:"5'8\"", reach:71, stance:'Switch', weight:'Flyweight', division:'FLW',
    record:'15-6-0', wins:15, losses:6, rank:null, p4p:null, color:'#3b82f6',
    slpm:4.4, strAcc:48, tdAvg:0.6, tdAcc:34, subAvg:0.2,
    style:'Rangy Striker', camp:'—', streak:'L1', notes:'Long, mobile American flyweight.', last:'L DEC' },
  oleksiejczuk: { id:'oleksiejczuk', name:'Michal Oleksiejczuk', nick:'—', country:'🇵🇱', age:31,
    height:"6'0\"", reach:75, stance:'Southpaw', weight:'Middleweight', division:'MW',
    record:'20-9-0', wins:20, losses:9, rank:null, p4p:null, color:'#16a34a',
    slpm:4.3, strAcc:49, tdAvg:0.5, tdAcc:33, subAvg:0.3,
    style:'Power Southpaw', camp:'—', streak:'W1', notes:'Heavy-handed Polish middleweight.', last:'W KO' },
  abusmag: { id:'abusmag', name:'Abusupiyan Magomedov', nick:'Abus', country:'🇩🇪', age:36,
    height:"6'3\"", reach:78, stance:'Switch', weight:'Middleweight', division:'MW',
    record:'27-7-1', wins:27, losses:7, rank:null, p4p:null, color:'#a855f7',
    slpm:4.6, strAcc:50, tdAvg:0.6, tdAcc:34, subAvg:0.2,
    style:'Explosive Striker', camp:'—', streak:'L1', notes:'Big, dynamic striker fighting out of Germany.', last:'L' },
  kuniev: { id:'kuniev', name:'Rizvan Kuniev', nick:'—', country:'🇷🇺', age:33,
    height:"6'3\"", reach:78, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'15-3-1', wins:15, losses:3, rank:null, p4p:null, color:'#eab308',
    slpm:3.4, strAcc:47, tdAvg:2.2, tdAcc:44, subAvg:0.8,
    style:'Wrestle-Grappler', camp:'—', streak:'W1', notes:'Dagestani heavyweight with a grappling base.', last:'W SUB' },
  fortune: { id:'fortune', name:'Tyrell Fortune', nick:'—', country:'🇺🇸', age:35,
    height:"6'1\"", reach:76, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'14-2-0', wins:14, losses:2, rank:null, p4p:null, color:'#f97316',
    slpm:3.0, strAcc:45, tdAvg:2.4, tdAcc:46, subAvg:0.3,
    style:'Power Wrestler', camp:'—', streak:'W1', notes:'Decorated wrestler turned heavyweight.', last:'W' },
  ruziboev: { id:'ruziboev', name:'Nursulton Ruziboev', nick:'—', country:'🇺🇿', age:30,
    height:"6'3\"", reach:79, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'36-9-2', wins:36, losses:9, rank:null, p4p:null, color:'#dc2626',
    slpm:3.6, strAcc:48, tdAvg:1.0, tdAcc:38, subAvg:1.2,
    style:'Long Finisher', camp:'—', streak:'W2', notes:'Lanky Uzbek with a deep finishing record.', last:'W SUB' },
  pulyaev: { id:'pulyaev', name:'Andrey Pulyaev', nick:'—', country:'🇷🇺', age:29,
    height:"6'1\"", reach:75, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'13-2-0', wins:13, losses:2, rank:null, p4p:null, color:'#3b82f6',
    slpm:3.9, strAcc:47, tdAvg:1.4, tdAcc:40, subAvg:0.5,
    style:'Well-Rounded', camp:'—', streak:'W3', notes:'Russian middleweight prospect.', last:'W' },
  jwalker: { id:'jwalker', name:'Julius Walker', nick:'—', country:'🇺🇸', age:28,
    height:"6'4\"", reach:80, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'9-1-0', wins:9, losses:1, rank:null, p4p:null, color:'#16a34a',
    slpm:3.8, strAcc:47, tdAvg:1.6, tdAcc:42, subAvg:0.8,
    style:'Athletic Finisher', camp:'—', streak:'W2', notes:'Tall light heavyweight prospect.', last:'W' },
  yakhyaev: { id:'yakhyaev', name:'Abdul-Rakhman Yakhyaev', nick:'—', country:'🇷🇺', age:30,
    height:"6'2\"", reach:77, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'10-1-0', wins:10, losses:1, rank:null, p4p:null, color:'#a855f7',
    slpm:3.7, strAcc:46, tdAvg:2.0, tdAcc:44, subAvg:0.6,
    style:'Wrestle-Striker', camp:'—', streak:'W2', notes:'Russian light heavyweight prospect.', last:'W' },
  almakhan: { id:'almakhan', name:'Bekzat Almakhan', nick:'—', country:'🇰🇿', age:27,
    height:"5'8\"", reach:70, stance:'Orthodox', weight:'Bantamweight', division:'BW',
    record:'12-1-0', wins:12, losses:1, rank:null, p4p:null, color:'#eab308',
    slpm:4.2, strAcc:48, tdAvg:1.4, tdAcc:42, subAvg:0.5,
    style:'Pressure Striker', camp:'—', streak:'W2', notes:'Kazakh bantamweight prospect.', last:'W KO' },
  matsumoto: { id:'matsumoto', name:'Jean Matsumoto', nick:'—', country:'🇧🇷', age:25,
    height:"5'8\"", reach:70, stance:'Orthodox', weight:'Bantamweight', division:'BW',
    record:'12-0-0', wins:12, losses:0, rank:null, p4p:null, color:'#f97316',
    slpm:4.3, strAcc:49, tdAvg:1.8, tdAcc:44, subAvg:0.6,
    style:'Undefeated Prospect', camp:'—', streak:'W12', notes:'Unbeaten Brazilian-Japanese bantamweight.', last:'W' },
  donchenko: { id:'donchenko', name:'Daniil Donchenko', nick:'—', country:'🇺🇦', age:31,
    height:"6'0\"", reach:74, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'10-1-0', wins:10, losses:1, rank:null, p4p:null, color:'#dc2626',
    slpm:4.0, strAcc:47, tdAvg:1.2, tdAcc:40, subAvg:0.5,
    style:'Pressure Striker', camp:'—', streak:'W3', notes:'Ukrainian welterweight prospect.', last:'W' },
  agust: { id:'agust', name:'Andreas Gustafsson', nick:'—', country:'🇸🇪', age:32,
    height:"6'0\"", reach:74, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'9-1-0', wins:9, losses:1, rank:null, p4p:null, color:'#3b82f6',
    slpm:3.8, strAcc:46, tdAvg:1.4, tdAcc:40, subAvg:0.4,
    style:'Well-Rounded', camp:'—', streak:'W1', notes:'Swedish welterweight prospect.', last:'W' },
  sadykhov: { id:'sadykhov', name:'Nazim Sadykhov', nick:'—', country:'🇦🇿', age:30,
    height:"5'10\"", reach:73, stance:'Southpaw', weight:'Lightweight', division:'LW',
    record:'11-1-1', wins:11, losses:1, rank:null, p4p:null, color:'#16a34a',
    slpm:4.6, strAcc:49, tdAvg:1.2, tdAcc:40, subAvg:0.6,
    style:'Aggressive Striker', camp:'—', streak:'W3', notes:'Azerbaijani lightweight fan favorite.', last:'W KO' },
  mcamilo: { id:'mcamilo', name:'Matheus Camilo', nick:'—', country:'🇧🇷', age:29,
    height:"5'10\"", reach:72, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'10-3-0', wins:10, losses:3, rank:null, p4p:null, color:'#a855f7',
    slpm:3.9, strAcc:45, tdAvg:1.5, tdAcc:42, subAvg:0.5,
    style:'Well-Rounded', camp:'—', streak:'W1', notes:'Brazilian lightweight prospect.', last:'W' },

  // ─── HISTORICAL — UFC 328 (Newark, May 9 2026) ───
  josvan: { id:'josvan', name:'Joshua Van', nick:'—', country:'🇲🇲', age:24,
    height:"5'6\"", reach:65, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'18-2-0', wins:18, losses:2, rank:'C', p4p:null, color:'#dc2626',
    slpm:6.8, strAcc:51, tdAvg:0.5, tdAcc:34, subAvg:0.2,
    style:'High-Volume Striker', camp:'—', streak:'W6', notes:'UFC flyweight champion; relentless pace.', last:'W TKO5 vs Taira' },
  taira: { id:'taira', name:'Tatsuro Taira', nick:'The Best', country:'🇯🇵', age:26,
    height:"5'7\"", reach:70, stance:'Southpaw', weight:'Flyweight', division:'FLW',
    record:'18-2-0', wins:18, losses:2, rank:3, p4p:null, color:'#3b82f6',
    slpm:3.9, strAcc:48, tdAvg:3.2, tdAcc:48, subAvg:1.3,
    style:'Grappler', camp:'The Blackbelt Japan', streak:'L1', notes:'#3 flyweight contender; fell short in a UFC 328 title classic vs Van. Career losses: Royval, Van.', last:'L TKO5 vs Van' },
  susurkaev: { id:'susurkaev', name:'Baisangur Susurkaev', nick:'—', country:'🇷🇺', age:26,
    height:"6'1\"", reach:75, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'11-1-0', wins:11, losses:1, rank:null, p4p:null, color:'#16a34a',
    slpm:4.0, strAcc:48, tdAvg:2.6, tdAcc:46, subAvg:1.1,
    style:'Finisher', camp:'—', streak:'W3', notes:'Surging middleweight prospect.', last:'W SUB3' },
  djsantos: { id:'djsantos', name:'Djorden Santos', nick:'—', country:'🇧🇷', age:28,
    height:"6'0\"", reach:74, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'9-2-0', wins:9, losses:2, rank:null, p4p:null, color:'#f97316',
    slpm:3.7, strAcc:45, tdAvg:1.2, tdAcc:38, subAvg:0.5,
    style:'Striker', camp:'—', streak:'L1', notes:'Brazilian middleweight prospect.', last:'L SUB3' },
  sabatini: { id:'sabatini', name:'Pat Sabatini', nick:'—', country:'🇺🇸', age:35,
    height:"5'8\"", reach:71, stance:'Orthodox', weight:'Featherweight', division:'FW',
    record:'20-6-0', wins:20, losses:6, rank:null, p4p:null, color:'#a855f7',
    slpm:3.2, strAcc:46, tdAvg:3.8, tdAcc:50, subAvg:1.6,
    style:'Wrestle-Grappler', camp:'—', streak:'W2', notes:'Grappling-heavy featherweight.', last:'W DEC' },
  gomis: { id:'gomis', name:'William Gomis', nick:'—', country:'🇫🇷', age:30,
    height:"5'10\"", reach:73, stance:'Orthodox', weight:'Featherweight', division:'FW',
    record:'15-3-0', wins:15, losses:3, rank:null, p4p:null, color:'#0ea5e9',
    slpm:3.8, strAcc:47, tdAvg:0.6, tdAcc:34, subAvg:0.3,
    style:'Striker', camp:'—', streak:'L1', notes:'French featherweight prospect.', last:'L DEC' },
  kopylov: { id:'kopylov', name:'Roman Kopylov', nick:'—', country:'🇷🇺', age:34,
    height:"6'1\"", reach:75, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'14-4-0', wins:14, losses:4, rank:null, p4p:null, color:'#dc2626',
    slpm:3.9, strAcc:49, tdAvg:0.4, tdAcc:32, subAvg:0.2,
    style:'KO Striker', camp:'—', streak:'W1', notes:'Russian middleweight with finishing power.', last:'W DEC' },
  mtulio: { id:'mtulio', name:'Marco Tulio', nick:'—', country:'🇧🇷', age:29,
    height:"6'0\"", reach:74, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'9-2-0', wins:9, losses:2, rank:null, p4p:null, color:'#16a34a',
    slpm:3.6, strAcc:45, tdAvg:1.0, tdAcc:38, subAvg:0.4,
    style:'Power Striker', camp:'—', streak:'L1', notes:'Brazilian middleweight prospect.', last:'L DEC' },
  jmiller: { id:'jmiller', name:'Jim Miller', nick:'—', country:'🇺🇸', age:42,
    height:"5'8\"", reach:71, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'40-19-0', wins:40, losses:19, rank:null, p4p:null, color:'#3b82f6',
    slpm:3.4, strAcc:44, tdAvg:1.6, tdAcc:40, subAvg:1.4,
    style:'Veteran Grappler', camp:'—', streak:'W2', notes:'Most-tenured fighter in UFC history.', last:'W SUB1' },
  jgordon: { id:'jgordon', name:'Jared Gordon', nick:'Flash', country:'🇺🇸', age:37,
    height:"5'8\"", reach:70, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'21-9-0', wins:21, losses:9, rank:null, p4p:null, color:'#f97316',
    slpm:4.0, strAcc:46, tdAvg:1.8, tdAcc:42, subAvg:0.4,
    style:'Pressure Fighter', camp:'—', streak:'L1', notes:'Durable lightweight veteran.', last:'L SUB1' },
  gdawson: { id:'gdawson', name:'Grant Dawson', nick:'KGD', country:'🇺🇸', age:32,
    height:"5'9\"", reach:72, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'22-1-1', wins:22, losses:1, rank:null, p4p:null, color:'#dc2626',
    slpm:3.6, strAcc:47, tdAvg:3.4, tdAcc:50, subAvg:1.7,
    style:'Suffocating Grappler', camp:'—', streak:'W2', notes:'Elite lightweight grappler.', last:'W SUB3' },
  rebecki: { id:'rebecki', name:'Mateusz Rebecki', nick:'—', country:'🇵🇱', age:33,
    height:"5'8\"", reach:70, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'19-3-0', wins:19, losses:3, rank:null, p4p:null, color:'#0ea5e9',
    slpm:4.3, strAcc:48, tdAvg:2.6, tdAcc:46, subAvg:0.7,
    style:'Power Wrestler', camp:'—', streak:'L1', notes:'Aggressive Polish lightweight.', last:'L SUB3' },
  gautier: { id:'gautier', name:'Ateba Gautier', nick:'—', country:'🇨🇲', age:24,
    height:"6'2\"", reach:78, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'9-1-0', wins:9, losses:1, rank:null, p4p:null, color:'#16a34a',
    slpm:4.2, strAcc:50, tdAvg:1.0, tdAcc:40, subAvg:0.6,
    style:'Finisher', camp:'—', streak:'W5', notes:'Fast-rising Cameroonian middleweight.', last:'W TKO2' },
  odiaz: { id:'odiaz', name:'Ozzy Diaz', nick:'—', country:'🇺🇸', age:30,
    height:"5'11\"", reach:74, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'11-3-0', wins:11, losses:3, rank:null, p4p:null, color:'#a855f7',
    slpm:3.8, strAcc:45, tdAvg:1.4, tdAcc:40, subAvg:0.4,
    style:'Well-Rounded', camp:'—', streak:'L1', notes:'American middleweight.', last:'L TKO2' },

  // ─── HISTORICAL — UFC 327 (Miami, Apr 11 2026) ───
  ulberg: { id:'ulberg', name:'Carlos Ulberg', nick:'Black Jag', country:'🇳🇿', age:35,
    height:"6'4\"", reach:79, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'15-1-0', wins:15, losses:1, rank:'C', p4p:null, color:'#dc2626',
    slpm:5.0, strAcc:54, tdAvg:0.3, tdAcc:30, subAvg:0.1,
    style:'Explosive KO Striker', camp:'City Kickboxing', streak:'W10', notes:'UFC light heavyweight champion; 10 straight wins.', last:'W KO1 vs Prochazka' },
  prochazka: { id:'prochazka', name:'Jiri Prochazka', nick:'Denisa', country:'🇨🇿', age:33,
    height:"6'4\"", reach:80, stance:'Switch', weight:'Light Heavyweight', division:'LHW',
    record:'32-6-1', wins:32, losses:6, rank:1, p4p:null, color:'#3b82f6',
    slpm:5.6, strAcc:50, tdAvg:0.6, tdAcc:35, subAvg:0.8,
    style:'Chaotic Berserker', camp:'—', streak:'L1', notes:'Former LHW champion; relentless, unpredictable.', last:'L KO1 vs Ulberg' },
  pcosta: { id:'pcosta', name:'Paulo Costa', nick:'Borrachinha', country:'🇧🇷', age:34,
    height:"6'1\"", reach:73, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'16-4-0', wins:16, losses:4, rank:null, p4p:null, color:'#16a34a',
    slpm:4.4, strAcc:52, tdAvg:0.4, tdAcc:33, subAvg:0.1,
    style:'Power Striker', camp:'—', streak:'W1', notes:'Heavy-handed Brazilian; moved up to 205.', last:'W TKO3' },
  murzakanov: { id:'murzakanov', name:'Azamat Murzakanov', nick:'The Professional', country:'🇷🇺', age:37,
    height:"5'11\"", reach:75, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'14-1-0', wins:14, losses:1, rank:null, p4p:null, color:'#f97316',
    slpm:3.8, strAcc:49, tdAvg:1.2, tdAcc:40, subAvg:0.3,
    style:'Explosive Athlete', camp:'—', streak:'L1', notes:'Long-unbeaten Russian light heavyweight.', last:'L TKO3' },
  blaydes: { id:'blaydes', name:'Curtis Blaydes', nick:'Razor', country:'🇺🇸', age:35,
    height:"6'4\"", reach:80, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'18-6-0', wins:18, losses:6, rank:null, p4p:null, color:'#0ea5e9',
    slpm:3.4, strAcc:52, tdAvg:4.0, tdAcc:48, subAvg:0.3,
    style:'Elite Wrestler', camp:'—', streak:'L1', notes:'Wrestling-based heavyweight contender.', last:'L DEC' },
  dreyes: { id:'dreyes', name:'Dominick Reyes', nick:'The Devastator', country:'🇺🇸', age:36,
    height:"6'4\"", reach:77, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'15-5-0', wins:15, losses:5, rank:null, p4p:null, color:'#dc2626',
    slpm:3.9, strAcc:50, tdAvg:0.5, tdAcc:34, subAvg:0.2,
    style:'Rangy Striker', camp:'—', streak:'W3', notes:'Former title challenger rebuilding momentum.', last:'W DEC' },
  johnnyw: { id:'johnnyw', name:'Johnny Walker', nick:'—', country:'🇧🇷', age:34,
    height:"6'5\"", reach:82, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'21-10-0', wins:21, losses:10, rank:null, p4p:null, color:'#16a34a',
    slpm:3.7, strAcc:47, tdAvg:0.4, tdAcc:32, subAvg:0.3,
    style:'Unorthodox Striker', camp:'—', streak:'L1', notes:'Long, dangerous Brazilian light heavyweight.', last:'L DEC' },
  cswanson: { id:'cswanson', name:'Cub Swanson', nick:'—', country:'🇺🇸', age:42,
    height:"5'8\"", reach:70, stance:'Orthodox', weight:'Featherweight', division:'FW',
    record:'29-15-0', wins:29, losses:15, rank:null, p4p:null, color:'#f97316',
    slpm:4.5, strAcc:44, tdAvg:0.5, tdAcc:34, subAvg:0.3,
    style:'Veteran Striker', camp:'—', streak:'W1', notes:'Beloved veteran; retired on a knockout win.', last:'W TKO1' },
  nlandwehr: { id:'nlandwehr', name:'Nate Landwehr', nick:'The Train', country:'🇺🇸', age:37,
    height:"5'11\"", reach:73, stance:'Southpaw', weight:'Featherweight', division:'FW',
    record:'18-7-0', wins:18, losses:7, rank:null, p4p:null, color:'#a855f7',
    slpm:4.7, strAcc:43, tdAvg:1.4, tdAcc:40, subAvg:0.8,
    style:'High-Energy Brawler', camp:'—', streak:'L1', notes:'All-action featherweight.', last:'L TKO1' },
  apico: { id:'apico', name:'Aaron Pico', nick:'—', country:'🇺🇸', age:29,
    height:"5'8\"", reach:69, stance:'Orthodox', weight:'Featherweight', division:'FW',
    record:'14-4-0', wins:14, losses:4, rank:null, p4p:null, color:'#dc2626',
    slpm:4.6, strAcc:49, tdAvg:2.0, tdAcc:46, subAvg:0.4,
    style:'Wrestle-Boxer', camp:'—', streak:'W2', notes:'Explosive, decorated wrestling base.', last:'W DEC' },
  pitbull: { id:'pitbull', name:'Patricio Pitbull', nick:'Pitbull', country:'🇧🇷', age:38,
    height:"5'7\"", reach:68, stance:'Orthodox', weight:'Featherweight', division:'FW',
    record:'36-8-0', wins:36, losses:8, rank:null, p4p:null, color:'#3b82f6',
    slpm:4.2, strAcc:47, tdAvg:0.8, tdAcc:36, subAvg:0.5,
    style:'Veteran Finisher', camp:'—', streak:'L1', notes:'Bellator\'s greatest featherweight ever.', last:'L DEC' },
  kholland: { id:'kholland', name:'Kevin Holland', nick:'Trailblazer', country:'🇺🇸', age:33,
    height:"6'3\"", reach:81, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'28-13-0', wins:28, losses:13, rank:null, p4p:null, color:'#16a34a',
    slpm:4.4, strAcc:48, tdAvg:0.6, tdAcc:34, subAvg:0.6,
    style:'Rangy Volume Striker', camp:'—', streak:'W1', notes:'Long, active welterweight.', last:'W DEC' },
  rbrown: { id:'rbrown', name:'Randy Brown', nick:'Rude Boy', country:'🇯🇲', age:35,
    height:"6'3\"", reach:78, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'19-6-0', wins:19, losses:6, rank:null, p4p:null, color:'#0ea5e9',
    slpm:3.9, strAcc:49, tdAvg:1.2, tdAcc:40, subAvg:0.6,
    style:'Long-Range Striker', camp:'—', streak:'L1', notes:'Tall, technical Jamaican welterweight.', last:'L DEC' },
  gamrot: { id:'gamrot', name:'Mateusz Gamrot', nick:'Gamer', country:'🇵🇱', age:34,
    height:"5'9\"", reach:73, stance:'Southpaw', weight:'Lightweight', division:'LW',
    record:'26-4-0', wins:26, losses:4, rank:6, p4p:null, color:'#dc2626',
    slpm:4.4, strAcc:49, tdAvg:3.6, tdAcc:48, subAvg:0.6,
    style:'Elite Wrestle-Boxer', camp:'—', streak:'W2', notes:'Top-ranked lightweight grinder.', last:'W SUB2' },
  ribovics: { id:'ribovics', name:'Esteban Ribovics', nick:'—', country:'🇦🇷', age:30,
    height:"5'10\"", reach:72, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'14-2-0', wins:14, losses:2, rank:null, p4p:null, color:'#f97316',
    slpm:4.8, strAcc:47, tdAvg:0.5, tdAcc:33, subAvg:0.2,
    style:'Aggressive Striker', camp:'—', streak:'L1', notes:'Exciting Argentine lightweight.', last:'L SUB2' },
  tsuarez: { id:'tsuarez', name:'Tatiana Suarez', nick:'—', country:'🇺🇸', age:35,
    height:"5'4\"", reach:64, stance:'Orthodox', weight:"Women's Strawweight", division:'WSW',
    record:'12-0-0', wins:12, losses:0, rank:1, p4p:null, color:'#a855f7',
    slpm:3.2, strAcc:46, tdAvg:5.0, tdAcc:54, subAvg:1.4,
    style:'Dominant Wrestler', camp:'—', streak:'W2', notes:'Unbeaten, suffocating top-control grappler.', last:'W SUB2' },
  godinez: { id:'godinez', name:'Loopy Godinez', nick:'Loopy', country:'🇲🇽', age:32,
    height:"5'2\"", reach:62, stance:'Orthodox', weight:"Women's Strawweight", division:'WSW',
    record:'13-5-0', wins:13, losses:5, rank:null, p4p:null, color:'#16a34a',
    slpm:4.3, strAcc:46, tdAvg:1.6, tdAcc:42, subAvg:0.4,
    style:'Pressure Fighter', camp:'—', streak:'L1', notes:'Busy, durable Mexican strawweight.', last:'L SUB2' },
  cpadilla: { id:'cpadilla', name:'Chris Padilla', nick:'—', country:'🇺🇸', age:33,
    height:"5'9\"", reach:72, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'10-4-0', wins:10, losses:4, rank:null, p4p:null, color:'#0ea5e9',
    slpm:4.0, strAcc:45, tdAvg:1.2, tdAcc:38, subAvg:0.4,
    style:'Striker', camp:'—', streak:'D1', notes:'American lightweight.', last:'D DRAW' },
  mederos: { id:'mederos', name:'Marquel Mederos', nick:'—', country:'🇺🇸', age:29,
    height:"5'10\"", reach:73, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'10-1-0', wins:10, losses:1, rank:null, p4p:null, color:'#dc2626',
    slpm:4.2, strAcc:47, tdAvg:1.0, tdAcc:38, subAvg:0.3,
    style:'Technical Striker', camp:'—', streak:'D1', notes:'Unbeaten-caliber lightweight prospect.', last:'D DRAW' },
  luque: { id:'luque', name:'Vicente Luque', nick:'The Silent Assassin', country:'🇧🇷', age:34,
    height:"5'11\"", reach:75, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'23-10-1', wins:23, losses:10, rank:null, p4p:null, color:'#3b82f6',
    slpm:4.6, strAcc:50, tdAvg:0.8, tdAcc:36, subAvg:1.0,
    style:'Finisher', camp:'—', streak:'W1', notes:'Dangerous welterweight everywhere.', last:'W SUB1' },
  gastelum: { id:'gastelum', name:'Kelvin Gastelum', nick:'—', country:'🇺🇸', age:34,
    height:"5'9\"", reach:71, stance:'Southpaw', weight:'Welterweight', division:'WW',
    record:'20-9-0', wins:20, losses:9, rank:null, p4p:null, color:'#16a34a',
    slpm:3.6, strAcc:48, tdAvg:1.8, tdAcc:42, subAvg:0.3,
    style:'Boxer-Wrestler', camp:'—', streak:'L1', notes:'Former title challenger and TUF winner.', last:'L SUB1' },
  radtke: { id:'radtke', name:'Charles Radtke', nick:'Chuck Buffalo', country:'🇺🇸', age:33,
    height:"5'11\"", reach:74, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'10-4-0', wins:10, losses:4, rank:null, p4p:null, color:'#f97316',
    slpm:4.3, strAcc:46, tdAvg:0.6, tdAcc:34, subAvg:0.3,
    style:'Brawler', camp:'—', streak:'W2', notes:'Hard-nosed American welterweight.', last:'W DEC' },
  fprado: { id:'fprado', name:'Francisco Prado', nick:'—', country:'🇦🇷', age:24,
    height:"5'11\"", reach:74, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'12-2-0', wins:12, losses:2, rank:null, p4p:null, color:'#a855f7',
    slpm:3.9, strAcc:45, tdAvg:0.8, tdAcc:36, subAvg:0.3,
    style:'Young Striker', camp:'—', streak:'L1', notes:'Argentine lightweight prospect.', last:'L DEC' },

  // ─── HISTORICAL — opponents for UFC 322 / 320 / 317 ───
  dellam: { id:'dellam', name:'Jack Della Maddalena', nick:'JDM', country:'🇦🇺', age:29,
    height:"5'11\"", reach:73, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'18-4-0', wins:18, losses:4, rank:4, p4p:null, color:'#dc2626',
    slpm:5.8, strAcc:51, tdAvg:0.2, tdAcc:28, subAvg:0.2,
    style:'Elite Boxer', camp:'—', streak:'L2', notes:'Former welterweight champion; world-class hands.', last:'L KO3 vs Prates' },
  ankalaev: { id:'ankalaev', name:'Magomed Ankalaev', nick:'—', country:'🇷🇺', age:33,
    height:"6'3\"", reach:75, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'21-2-1', wins:21, losses:2, rank:2, p4p:null, color:'#3b82f6',
    slpm:3.4, strAcc:52, tdAvg:1.6, tdAcc:46, subAvg:0.3,
    style:'Counter-Striker + Wrestling', camp:'—', streak:'L1', notes:'Former LHW champion; technical and durable.', last:'L KO1' },
  coliveira: { id:'coliveira', name:'Charles Oliveira', nick:'do Bronx', country:'🇧🇷', age:36,
    height:"5'10\"", reach:74, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'37-11-0', wins:37, losses:11, rank:2, p4p:9, color:'#16a34a',
    slpm:3.5, strAcc:52, tdAvg:1.5, tdAcc:40, subAvg:2.6,
    style:'Elite Submission Grappler', camp:'Chute Boxe Diego Lima', streak:'W2', notes:'UFC\'s all-time submission and finish leader; reigning BMF champion.', last:'W DEC vs Holloway' },
  holloway: { id:'holloway', name:'Max Holloway', nick:'Blessed', country:'🇺🇸', age:34,
    height:"5'11\"", reach:69, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'27-9-0', wins:27, losses:9, rank:3, p4p:10, color:'#0ea5e9',
    slpm:7.2, strAcc:48, tdAvg:0.3, tdAcc:30, subAvg:0.1,
    style:'Record-Setting Volume Striker', camp:'Hawaii Elite MMA', streak:'L1', notes:'Former featherweight champion; holds the UFC significant-strikes record. Record approximate.', last:'L DEC vs Oliveira' },

  // ─── HEAVYWEIGHT ROSTER IMPORT (records per UFC rankings, May 12 2026) ───
  aspinall: { id:'aspinall', name:'Tom Aspinall', nick:'—', country:'🇬🇧', age:32,
    height:"6'5\"", reach:78, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'15-3-0', wins:15, losses:3, rank:'C', p4p:7, color:'#dc2626',
    slpm:4.6, strAcc:55, tdAvg:1.8, tdAcc:46, subAvg:1.2,
    style:'Explosive Finisher', camp:'Team Kaobon', streak:'W6', notes:'UFC heavyweight champion; fastest hands in the division.', last:'NC vs Gane' },
  volkov: { id:'volkov', name:'Alexander Volkov', nick:'Drago', country:'🇷🇺', age:37,
    height:"6'7\"", reach:80, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'40-11-0', wins:40, losses:11, rank:1, p4p:null, color:'#3b82f6',
    slpm:4.8, strAcc:56, tdAvg:0.3, tdAcc:30, subAvg:0.4,
    style:'Rangy Kickboxer', camp:'—', streak:'W3', notes:'Towering striker on a title-contention run; beat Cortes-Acosta at UFC 328.', last:'W DEC vs Cortes-Acosta' },
  cortes: { id:'cortes', name:'Waldo Cortes-Acosta', nick:'Salsa Boy', country:'🇩🇴', age:34,
    height:"6'4\"", reach:80, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'17-3-0', wins:17, losses:3, rank:4, p4p:null, color:'#f59e0b',
    slpm:4.6, strAcc:53, tdAvg:0.4, tdAcc:35, subAvg:0.2,
    style:'Boxer', camp:'—', streak:'L1', notes:'Slick heavyweight boxer; dropped a decision to Volkov.', last:'L DEC vs Volkov' },
  spivac: { id:'spivac', name:'Serghei Spivac', nick:'Polar Bear', country:'🇲🇩', age:30,
    height:"6'4\"", reach:78, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'18-6-0', wins:18, losses:6, rank:6, p4p:null, color:'#0ea5e9',
    slpm:2.8, strAcc:50, tdAvg:3.6, tdAcc:48, subAvg:1.4,
    style:'Top-Pressure Grappler', camp:'—', streak:'W1', notes:'Heavy top-control heavyweight grappler.', last:'W' },
  tybura: { id:'tybura', name:'Marcin Tybura', nick:'—', country:'🇵🇱', age:39,
    height:"6'3\"", reach:78, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'27-11-0', wins:27, losses:11, rank:12, p4p:null, color:'#16a34a',
    slpm:3.0, strAcc:48, tdAvg:2.4, tdAcc:44, subAvg:0.6,
    style:'Veteran Grappler', camp:'—', streak:'L1', notes:'Long-tenured heavyweight gatekeeper.', last:'L' },
  delija: { id:'delija', name:'Ante Delija', nick:'Walking Trouble', country:'🇭🇷', age:35,
    height:"6'5\"", reach:79, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'26-8-0', wins:26, losses:8, rank:11, p4p:null, color:'#dc2626',
    slpm:4.0, strAcc:49, tdAvg:1.0, tdAcc:38, subAvg:0.7,
    style:'Pressure Striker', camp:'—', streak:'W2', notes:'Former PFL heavyweight champion.', last:'W' },
  gaziev: { id:'gaziev', name:'Shamil Gaziev', nick:'Abrek', country:'🇧🇭', age:33,
    height:"6'3\"", reach:77, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'14-4-0', wins:14, losses:4, rank:null, p4p:null, color:'#a855f7',
    slpm:4.2, strAcc:52, tdAvg:1.6, tdAcc:42, subAvg:0.5,
    style:'Powerful Pressure Fighter', camp:'—', streak:'L1', notes:'Heavy-handed pressure heavyweight.', last:'L KO2 vs Pericic' },
  vwalker: { id:'vwalker', name:'Valter Walker', nick:'—', country:'🇧🇷', age:27,
    height:"6'5\"", reach:81, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'15-1-0', wins:15, losses:1, rank:13, p4p:null, color:'#f97316',
    slpm:2.6, strAcc:47, tdAvg:2.0, tdAcc:44, subAvg:1.8,
    style:'Leg-Lock Grappler', camp:'—', streak:'W4', notes:'Brother of Johnny Walker; on a run of heel-hook finishes.', last:'W SUB1' },
  parkin: { id:'parkin', name:'Mick Parkin', nick:'—', country:'🇬🇧', age:28,
    height:"6'4\"", reach:78, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'10-1-0', wins:10, losses:1, rank:14, p4p:null, color:'#3b82f6',
    slpm:3.4, strAcc:50, tdAvg:1.4, tdAcc:42, subAvg:0.4,
    style:'Technical Heavyweight', camp:'—', streak:'L1', notes:'British heavyweight prospect.', last:'L' },
  pericic: { id:'pericic', name:'Brando Peričić', nick:'—', country:'🇭🇷', age:28,
    height:"6'6\"", reach:80, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'8-1-0', wins:8, losses:1, rank:null, p4p:null, color:'#0ea5e9',
    slpm:3.6, strAcc:51, tdAvg:0.8, tdAcc:38, subAvg:0.6,
    style:'Finisher', camp:'—', streak:'W4', notes:'Fast-rising Croatian heavyweight prospect.', last:'W KO2 vs Gaziev' },
  tuivasa: { id:'tuivasa', name:'Tai Tuivasa', nick:'Bam Bam', country:'🇦🇺', age:33,
    height:"6'2\"", reach:75, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'15-8-0', wins:15, losses:8, rank:null, p4p:null, color:'#dc2626',
    slpm:4.4, strAcc:50, tdAvg:0.2, tdAcc:28, subAvg:0.1,
    style:'KO Brawler', camp:'—', streak:'L7', notes:'Fan-favorite Australian knockout artist.', last:'L DEC vs Sutherland' },
  saricam: { id:'saricam', name:'Gokhan Saricam', nick:'Turkish Hammer', country:'🇹🇷', age:28,
    height:"6'6\"", reach:80, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'13-2-0', wins:13, losses:2, rank:null, p4p:null, color:'#f97316',
    slpm:4.0, strAcc:51, tdAvg:0.6, tdAcc:36, subAvg:0.3,
    style:'KO Striker', camp:'—', streak:'W2', notes:'Powerful Turkish heavyweight prospect.', last:'W KO2 vs Boser' },
  boser: { id:'boser', name:'Tanner Boser', nick:'The Bulldozer', country:'🇨🇦', age:34,
    height:"6'1\"", reach:76, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'21-13-1', wins:21, losses:13, rank:null, p4p:null, color:'#16a34a',
    slpm:4.1, strAcc:49, tdAvg:0.6, tdAcc:36, subAvg:0.3,
    style:'Boxer', camp:'—', streak:'L1', notes:'Durable Canadian heavyweight veteran (record approximate).', last:'L KO2 vs Saricam' },
  alane: { id:'alane', name:'Austen Lane', nick:'—', country:'🇺🇸', age:38,
    height:"6'6\"", reach:80, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'13-6-1', wins:13, losses:6, rank:null, p4p:null, color:'#f59e0b',
    slpm:3.8, strAcc:47, tdAvg:0.5, tdAcc:34, subAvg:0.2,
    style:'Athletic Striker', camp:'—', streak:'W1', notes:'Former NFL defensive end turned heavyweight (record approximate).', last:'W' },
  mpinto: { id:'mpinto', name:'Mario Pinto', nick:'—', country:'🇧🇷', age:28,
    height:"6'4\"", reach:78, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'9-0-0', wins:9, losses:0, rank:null, p4p:null, color:'#a855f7',
    slpm:3.9, strAcc:52, tdAvg:1.2, tdAcc:40, subAvg:0.5,
    style:'Unbeaten Prospect', camp:'—', streak:'W9', notes:'Undefeated Brazilian heavyweight prospect (record approximate).', last:'W' },
  tpetersen: { id:'tpetersen', name:'Thomas Petersen', nick:'—', country:'🇺🇸', age:32,
    height:"6'4\"", reach:78, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'9-2-0', wins:9, losses:2, rank:null, p4p:null, color:'#0ea5e9',
    slpm:3.0, strAcc:48, tdAvg:3.0, tdAcc:46, subAvg:0.6,
    style:'Grappler', camp:'—', streak:'W1', notes:'American heavyweight grappler (record approximate).', last:'W' },
  buchecha: { id:'buchecha', name:'Marcus Almeida', nick:'Buchecha', country:'🇧🇷', age:35,
    height:"6'4\"", reach:77, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'5-3-1', wins:5, losses:3, rank:null, p4p:null, color:'#16a34a',
    slpm:2.4, strAcc:46, tdAvg:3.4, tdAcc:50, subAvg:2.2,
    style:'Elite Submission Grappler', camp:'—', streak:'L1', notes:'13-time jiu-jitsu world champion competing in MMA (record approximate).', last:'L KO2 vs Spann' },
  satybaldiev: { id:'satybaldiev', name:'Uran Satybaldiev', nick:'—', country:'🇰🇬', age:27,
    height:"6'3\"", reach:77, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'10-1-0', wins:10, losses:1, rank:null, p4p:null, color:'#3b82f6',
    slpm:3.2, strAcc:49, tdAvg:2.4, tdAcc:44, subAvg:0.8,
    style:'Grappler', camp:'—', streak:'W2', notes:'Kyrgyz heavyweight prospect (record approximate).', last:'W' },

  // ─── LIGHT HEAVYWEIGHT ROSTER IMPORT ───
  rakic: { id:'rakic', name:'Aleksandar Rakic', nick:'—', country:'🇦🇹', age:33,
    height:"6'5\"", reach:78, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'14-6-0', wins:14, losses:6, rank:12, p4p:null, color:'#dc2626',
    slpm:3.6, strAcc:51, tdAvg:1.2, tdAcc:40, subAvg:0.3,
    style:'Kickboxer', camp:'—', streak:'L1', notes:'Powerful Austrian light heavyweight striker.', last:'L' },
  spann: { id:'spann', name:'Ryan Spann', nick:'Superman', country:'🇺🇸', age:34,
    height:"6'5\"", reach:79, stance:'Orthodox', weight:'Heavyweight', division:'HW',
    record:'24-11-0', wins:24, losses:11, rank:null, p4p:null, color:'#f59e0b',
    slpm:3.4, strAcc:49, tdAvg:1.0, tdAcc:38, subAvg:1.0,
    style:'Finisher', camp:'—', streak:'W2', notes:'Long, dangerous finisher; moved up to heavyweight.', last:'W KO2 vs Buchecha' },
  nzechukwu: { id:'nzechukwu', name:'Kennedy Nzechukwu', nick:'—', country:'🇳🇬', age:33,
    height:"6'5\"", reach:80, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'14-5-0', wins:14, losses:5, rank:null, p4p:null, color:'#a855f7',
    slpm:4.0, strAcc:50, tdAvg:0.8, tdAcc:36, subAvg:0.4,
    style:'Rangy Striker', camp:'—', streak:'W1', notes:'Tall Nigerian light heavyweight (record approximate).', last:'W' },
  petrino: { id:'petrino', name:'Vitor Petrino', nick:'Icão', country:'🇧🇷', age:28,
    height:"6'2\"", reach:77, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'11-2-0', wins:11, losses:2, rank:null, p4p:null, color:'#0ea5e9',
    slpm:3.6, strAcc:50, tdAvg:2.6, tdAcc:46, subAvg:0.5,
    style:'Wrestle-Striker', camp:'—', streak:'W1', notes:'Brazilian light heavyweight prospect.', last:'W KO3 vs Petersen' },

  // ─── LIGHT HEAVYWEIGHT ROSTER IMPORT (records cross-checked May 2026) ───
  blachowicz: { id:'blachowicz', name:'Jan Blachowicz', nick:'—', country:'🇵🇱', age:43,
    height:"6'2\"", reach:78, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'29-11-2', wins:29, losses:11, rank:null, p4p:null, color:'#16a34a',
    slpm:3.4, strAcc:46, tdAvg:1.6, tdAcc:42, subAvg:0.6,
    style:'Veteran Power Striker', camp:'—', streak:'D1', notes:'Former UFC light heavyweight champion.', last:'D' },
  rountree: { id:'rountree', name:'Khalil Rountree Jr.', nick:'The War Horse', country:'🇺🇸', age:36,
    height:"6'2\"", reach:76, stance:'Southpaw', weight:'Light Heavyweight', division:'LHW',
    record:'14-7-0', wins:14, losses:7, rank:6, p4p:null, color:'#dc2626',
    slpm:4.6, strAcc:54, tdAvg:0.2, tdAcc:28, subAvg:0.1,
    style:'Explosive KO Striker', camp:'Xtreme Couture', streak:'L1', notes:'Power-striking former title challenger.', last:'L' },
  oezdemir: { id:'oezdemir', name:'Volkan Oezdemir', nick:'No Time', country:'🇨🇭', age:36,
    height:"6'2\"", reach:75, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'21-8-0', wins:21, losses:8, rank:9, p4p:null, color:'#3b82f6',
    slpm:3.6, strAcc:50, tdAvg:0.5, tdAcc:34, subAvg:0.2,
    style:'Counter KO Striker', camp:'—', streak:'W1', notes:'Former title challenger; heavy hands.', last:'W' },
  guskov: { id:'guskov', name:'Bogdan Guskov', nick:'The Bullet', country:'🇺🇿', age:33,
    height:"6'3\"", reach:78, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'18-3-1', wins:18, losses:3, rank:10, p4p:null, color:'#f59e0b',
    slpm:4.2, strAcc:52, tdAvg:0.6, tdAcc:36, subAvg:0.4,
    style:'Aggressive Finisher', camp:'—', streak:'W2', notes:'Hard-hitting Uzbek light heavyweight.', last:'W' },
  krylov: { id:'krylov', name:'Nikita Krylov', nick:'The Miner', country:'🇺🇦', age:33,
    height:"6'3\"", reach:77, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'31-11-0', wins:31, losses:11, rank:13, p4p:null, color:'#a855f7',
    slpm:3.5, strAcc:48, tdAvg:1.8, tdAcc:42, subAvg:1.3,
    style:'Well-Rounded Finisher', camp:'—', streak:'W1', notes:'Long-tenured, dangerous everywhere.', last:'W' },
  jhill: { id:'jhill', name:'Jamahal Hill', nick:'Sweet Dreams', country:'🇺🇸', age:34,
    height:"6'4\"", reach:79, stance:'Southpaw', weight:'Light Heavyweight', division:'LHW',
    record:'12-4-0', wins:12, losses:4, rank:8, p4p:null, color:'#dc2626',
    slpm:4.8, strAcc:51, tdAvg:0.3, tdAcc:30, subAvg:0.2,
    style:'Rangy Volume Striker', camp:'—', streak:'L1', notes:'Former UFC light heavyweight champion.', last:'L' },
  jacoby: { id:'jacoby', name:'Dustin Jacoby', nick:'The Hanyak', country:'🇺🇸', age:37,
    height:"6'4\"", reach:79, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'20-9-1', wins:20, losses:9, rank:7, p4p:null, color:'#0ea5e9',
    slpm:4.4, strAcc:50, tdAvg:0.4, tdAcc:32, subAvg:0.2,
    style:'Kickboxer', camp:'Factory X', streak:'W2', notes:'Veteran kickboxer; back-to-back knockouts.', last:'W KO1 vs Lopes' },
  crute: { id:'crute', name:'Jimmy Crute', nick:'The Brute', country:'🇦🇺', age:30,
    height:"6'1\"", reach:74, stance:'Southpaw', weight:'Light Heavyweight', division:'LHW',
    record:'12-4-1', wins:12, losses:4, rank:null, p4p:null, color:'#16a34a',
    slpm:3.2, strAcc:47, tdAvg:2.4, tdAcc:46, subAvg:1.4,
    style:'Grappler', camp:'—', streak:'W2', notes:'Australian grappler; out with an ACL injury.', last:'W SUB1' },
  zhangm: { id:'zhangm', name:'Zhang Mingyang', nick:'Mountain Tiger', country:'🇨🇳', age:31,
    height:"6'3\"", reach:79, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'18-6-0', wins:18, losses:6, rank:14, p4p:null, color:'#dc2626',
    slpm:5.0, strAcc:53, tdAvg:0.3, tdAcc:30, subAvg:0.2,
    style:'First-Round KO Artist', camp:'—', streak:'L1', notes:'Chinese knockout specialist; faces Menifield May 30.', last:'L KO2 vs Walker' },
  whittaker: { id:'whittaker', name:'Robert Whittaker', nick:'The Reaper', country:'🇦🇺', age:35,
    height:"6'0\"", reach:73, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'26-9-0', wins:26, losses:9, rank:3, p4p:null, color:'#0ea5e9',
    slpm:4.4, strAcc:48, tdAvg:1.0, tdAcc:42, subAvg:0.2,
    style:'Elite Counter-Striker', camp:'—', streak:'L1', notes:'Former UFC middleweight champion (record approximate).', last:'L' },
  jtafa: { id:'jtafa', name:'Junior Tafa', nick:'Juggernaut', country:'🇦🇺', age:30,
    height:"6'4\"", reach:78, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'6-3-0', wins:6, losses:3, rank:null, p4p:null, color:'#f59e0b',
    slpm:4.5, strAcc:50, tdAvg:0.2, tdAcc:26, subAvg:0.1,
    style:'KO Striker', camp:'—', streak:'W1', notes:'Tongan-Australian knockout artist (record approximate).', last:'W' },
  aslan: { id:'aslan', name:'Ibo Aslan', nick:'The Last Ottoman', country:'🇹🇷', age:28,
    height:"6'3\"", reach:78, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'14-1-0', wins:14, losses:1, rank:null, p4p:null, color:'#16a34a',
    slpm:4.3, strAcc:52, tdAvg:1.2, tdAcc:40, subAvg:0.6,
    style:'Finisher', camp:'—', streak:'W2', notes:'Turkish light heavyweight prospect.', last:'W' },
  osy: { id:'osy', name:'Oumar Sy', nick:'—', country:'🇫🇷', age:30,
    height:"6'4\"", reach:83, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'12-2-0', wins:12, losses:2, rank:null, p4p:null, color:'#a855f7',
    slpm:3.8, strAcc:51, tdAvg:1.8, tdAcc:44, subAvg:0.7,
    style:'Rangy Grappler', camp:'American Top Team', streak:'L1', notes:'Long, rangy French light heavyweight; UFC losses to Menifield and Cutelaba.', last:'L SUB1 vs Cutelaba' },
  bellato: { id:'bellato', name:'Rodolfo Bellato', nick:'Trator', country:'🇧🇷', age:30,
    height:"6'2\"", reach:77, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'12-2-0', wins:12, losses:2, rank:null, p4p:null, color:'#f97316',
    slpm:3.9, strAcc:49, tdAvg:1.6, tdAcc:42, subAvg:0.8,
    style:'Pressure Finisher', camp:'—', streak:'W1', notes:'Brazilian light heavyweight prospect.', last:'W' },
  ribeiro: { id:'ribeiro', name:'Brendson Ribeiro', nick:'The Gorilla', country:'🇧🇷', age:32,
    height:"6'3\"", reach:79, stance:'Southpaw', weight:'Light Heavyweight', division:'LHW',
    record:'16-7-0', wins:16, losses:7, rank:null, p4p:null, color:'#3b82f6',
    slpm:4.1, strAcc:48, tdAvg:0.8, tdAcc:36, subAvg:0.7,
    style:'Southpaw Striker', camp:'—', streak:'L1', notes:'Brazilian light heavyweight.', last:'L' },
  nstirling: { id:'nstirling', name:'Navajo Stirling', nick:'—', country:'🇳🇿', age:26,
    height:"6'4\"", reach:79, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'6-0-0', wins:6, losses:0, rank:null, p4p:null, color:'#dc2626',
    slpm:3.7, strAcc:50, tdAvg:1.4, tdAcc:42, subAvg:0.5,
    style:'Unbeaten Prospect', camp:'City Kickboxing', streak:'W6', notes:'Undefeated City Kickboxing light heavyweight prospect.', last:'W' },
  blopes: { id:'blopes', name:'Bruno Lopes', nick:'Brunão', country:'🇧🇷', age:31,
    height:"6'3\"", reach:77, stance:'Orthodox', weight:'Light Heavyweight', division:'LHW',
    record:'14-1-0', wins:14, losses:1, rank:null, p4p:null, color:'#16a34a',
    slpm:3.8, strAcc:50, tdAvg:1.0, tdAcc:38, subAvg:0.9,
    style:'Finisher', camp:'—', streak:'L1', notes:'Brazilian light heavyweight prospect (record approximate).', last:'L' },

  // ─── UFC PERTH + UFC VEGAS 116 CARD IMPORTS (cross-checked May 2026) ───
  prates: { id:'prates', name:'Carlos Prates', nick:'The Nightmare', country:'🇧🇷', age:32,
    height:"6'1\"", reach:76, stance:'Southpaw', weight:'Welterweight', division:'WW',
    record:'24-7-0', wins:24, losses:7, rank:5, p4p:null, color:'#dc2626',
    slpm:5.4, strAcc:55, tdAvg:0.2, tdAcc:30, subAvg:0.3,
    style:'Devastating Southpaw Striker', camp:'Fighting Nerds', streak:'W3', notes:'Brazilian knockout artist; back-to-back stoppages of former champions.', last:'W KO3 vs Della Maddalena' },
  salkilld: { id:'salkilld', name:'Quillan Salkilld', nick:'—', country:'🇦🇺', age:26,
    height:"5'10\"", reach:72, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'12-1-0', wins:12, losses:1, rank:null, p4p:null, color:'#0ea5e9',
    slpm:4.6, strAcc:53, tdAvg:0.6, tdAcc:36, subAvg:0.2,
    style:'Explosive Finisher', camp:'—', streak:'W6', notes:'Surging Perth lightweight; 5-0 in the UFC with four first-round wins.', last:'W KO1 vs Dariush' },
  dariush: { id:'dariush', name:'Beneil Dariush', nick:'—', country:'🇮🇷', age:37,
    height:"5'10\"", reach:72, stance:'Southpaw', weight:'Lightweight', division:'LW',
    record:'23-8-1', wins:23, losses:8, rank:null, p4p:null, color:'#a855f7',
    slpm:3.3, strAcc:47, tdAvg:1.9, tdAcc:42, subAvg:1.2,
    style:'Grappling-Heavy Veteran', camp:'Kings MMA', streak:'L2', notes:'Long-tenured lightweight contender and seasoned grappler.', last:'L KO1 vs Salkilld' },
  erceg: { id:'erceg', name:'Steve Erceg', nick:'Astro Boy', country:'🇦🇺', age:30,
    height:"5'7\"", reach:70, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'13-4-0', wins:13, losses:4, rank:7, p4p:null, color:'#0ea5e9',
    slpm:3.8, strAcc:49, tdAvg:1.6, tdAcc:44, subAvg:0.6,
    style:'Well-Rounded', camp:'Scrappy MMA', streak:'W2', notes:'Australian flyweight; former title challenger (record approximate).', last:'W DEC vs Elliott' },
  elliott: { id:'elliott', name:'Tim Elliott', nick:'—', country:'🇺🇸', age:39,
    height:"5'8\"", reach:67, stance:'Orthodox', weight:'Flyweight', division:'FLW',
    record:'20-14-1', wins:20, losses:14, rank:null, p4p:null, color:'#f59e0b',
    slpm:3.6, strAcc:42, tdAvg:3.0, tdAcc:38, subAvg:0.7,
    style:'Scrappy Veteran', camp:'—', streak:'L1', notes:'Long-time flyweight gatekeeper and former title challenger (record approximate).', last:'L DEC vs Erceg' },
  sterling: { id:'sterling', name:'Aljamain Sterling', nick:'Funk Master', country:'🇺🇸', age:36,
    height:"5'7\"", reach:71, stance:'Orthodox', weight:'Featherweight', division:'FW',
    record:'26-5-0', wins:26, losses:5, rank:5, p4p:null, color:'#16a34a',
    slpm:4.0, strAcc:46, tdAvg:3.0, tdAcc:42, subAvg:1.0,
    style:'Elite Grappler', camp:'Serra-Longo', streak:'W2', notes:'Former UFC bantamweight champion climbing the featherweight ranks.', last:'W DEC vs Zalal' },
  zalal: { id:'zalal', name:'Youssef Zalal', nick:'The Moroccan Devil', country:'🇲🇦', age:29,
    height:"5'8\"", reach:73, stance:'Orthodox', weight:'Featherweight', division:'FW',
    record:'18-6-1', wins:18, losses:6, rank:12, p4p:null, color:'#dc2626',
    slpm:4.3, strAcc:48, tdAvg:1.8, tdAcc:40, subAvg:0.8,
    style:'Active Finisher', camp:'Factory X', streak:'L1', notes:'Surging featherweight; rebuilt his career on a five-fight UFC win streak.', last:'L DEC vs Sterling' },
  jedwards: { id:'jedwards', name:'Joselyne Edwards', nick:'La Pantera', country:'🇵🇦', age:31,
    height:"5'9\"", reach:70, stance:'Orthodox', weight:"Women's Bantamweight", division:'WBW',
    record:'18-6-0', wins:18, losses:6, rank:9, p4p:null, color:'#a855f7',
    slpm:3.7, strAcc:47, tdAvg:1.0, tdAcc:36, subAvg:0.3,
    style:'Pressure Striker', camp:'—', streak:'W2', notes:'Panamanian women\'s bantamweight on the rise.', last:'W DEC vs Dumont' },
  dumont: { id:'dumont', name:'Norma Dumont', nick:'—', country:'🇧🇷', age:35,
    height:"5'8\"", reach:67, stance:'Orthodox', weight:"Women's Bantamweight", division:'WBW',
    record:'13-3-0', wins:13, losses:3, rank:5, p4p:null, color:'#0ea5e9',
    slpm:4.0, strAcc:48, tdAvg:1.4, tdAcc:42, subAvg:0.4,
    style:'Technical Striker', camp:'—', streak:'L1', notes:'Ranked Brazilian women\'s bantamweight.', last:'L DEC vs Edwards' },
  rgarcia: { id:'rgarcia', name:'Rafa Garcia', nick:'—', country:'🇲🇽', age:29,
    height:"5'8\"", reach:70, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'18-4-0', wins:18, losses:4, rank:null, p4p:null, color:'#16a34a',
    slpm:4.4, strAcc:47, tdAvg:2.2, tdAcc:42, subAvg:0.4,
    style:'Pressure Fighter', camp:'Bloodline Combat Sports', streak:'W3', notes:'Mexican lightweight on a three-fight win streak (record approximate).', last:'W DEC vs Hernandez' },
  ahernandez: { id:'ahernandez', name:'Alexander Hernandez', nick:'The Great', country:'🇺🇸', age:33,
    height:"5'8\"", reach:71, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'15-9-0', wins:15, losses:9, rank:null, p4p:null, color:'#dc2626',
    slpm:4.1, strAcc:46, tdAvg:1.6, tdAcc:40, subAvg:0.4,
    style:'Athletic Striker', camp:'—', streak:'L1', notes:'Explosive American lightweight (record approximate).', last:'L DEC vs Garcia' },
  mcvey: { id:'mcvey', name:'Jackson McVey', nick:'The Moose', country:'🇺🇸', age:28,
    height:"6'1\"", reach:75, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'8-2-0', wins:8, losses:2, rank:null, p4p:null, color:'#0ea5e9',
    slpm:3.5, strAcc:48, tdAvg:2.4, tdAcc:44, subAvg:1.6,
    style:'Submission Finisher', camp:'—', streak:'W1', notes:'Middleweight grappler; every regional win came inside the distance (record approximate).', last:'W SUB1 vs Dumas' },
  dumas: { id:'dumas', name:'Sedriques Dumas', nick:'—', country:'🇺🇸', age:29,
    height:"6'2\"", reach:77, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'9-4-0', wins:9, losses:4, rank:null, p4p:null, color:'#f59e0b',
    slpm:4.0, strAcc:48, tdAvg:0.8, tdAcc:36, subAvg:0.3,
    style:'Athletic Striker', camp:'—', streak:'L1', notes:'Athletic American middleweight (record approximate).', last:'L SUB1 vs McVey' },

  // ─── UFC WINNIPEG + UFC VEGAS 115 CARD IMPORTS (cross-checked May 2026) ───
  burns: { id:'burns', name:'Gilbert Burns', nick:'Durinho', country:'🇧🇷', age:39,
    height:"5'10\"", reach:71, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'22-10-0', wins:22, losses:10, rank:null, p4p:null, color:'#16a34a',
    slpm:3.6, strAcc:48, tdAvg:1.9, tdAcc:42, subAvg:1.1,
    style:'Elite BJJ Power Striker', camp:'Sanford MMA', streak:'L5', notes:'Former welterweight title challenger; retired after this bout (record approximate).', last:'L KO3 vs Malott' },
  malott: { id:'malott', name:'Mike Malott', nick:'Proper', country:'🇨🇦', age:34,
    height:"6'0\"", reach:74, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'14-2-1', wins:14, losses:2, rank:15, p4p:null, color:'#dc2626',
    slpm:4.3, strAcc:52, tdAvg:1.6, tdAcc:44, subAvg:1.0,
    style:'Well-Rounded Finisher', camp:'Niagara Top Team', streak:'W4', notes:'Canadian welterweight; broke into the Top 15 with this win.', last:'W KO3 vs Burns' },
  jourdain: { id:'jourdain', name:'Charles Jourdain', nick:'Air', country:'🇨🇦', age:30,
    height:"5'9\"", reach:72, stance:'Southpaw', weight:'Bantamweight', division:'BW',
    record:'16-7-1', wins:16, losses:7, rank:null, p4p:null, color:'#0ea5e9',
    slpm:4.6, strAcc:47, tdAvg:0.6, tdAcc:34, subAvg:0.6,
    style:'Aggressive Striker', camp:'Tristar', streak:'W3', notes:'Canadian striker on a three-fight run since dropping to bantamweight (record approximate).', last:'W DEC vs Phillips' },
  kphillips: { id:'kphillips', name:'Kyler Phillips', nick:'The Matrix', country:'🇺🇸', age:30,
    height:"5'8\"", reach:71, stance:'Orthodox', weight:'Bantamweight', division:'BW',
    record:'12-5-0', wins:12, losses:5, rank:14, p4p:null, color:'#a855f7',
    slpm:4.4, strAcc:50, tdAvg:1.4, tdAcc:42, subAvg:0.5,
    style:'Dynamic Striker', camp:'The MMA Lab', streak:'L1', notes:'Ranked, flashy American bantamweight (record approximate).', last:'L DEC vs Jourdain' },
  moicano: { id:'moicano', name:'Renato Moicano', nick:'Money', country:'🇧🇷', age:36,
    height:"5'11\"", reach:72, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'21-7-1', wins:21, losses:7, rank:10, p4p:null, color:'#dc2626',
    slpm:4.5, strAcc:49, tdAvg:1.3, tdAcc:40, subAvg:1.2,
    style:'Pressure Jiu-Jitsu', camp:'American Top Team', streak:'W1', notes:'Tenured top-15 lightweight; recent losses came to Makhachev and Dariush (record approximate).', last:'W SUB2 vs Duncan' },
  duncan: { id:'duncan', name:'Chris Duncan', nick:'The Problem', country:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', age:33,
    height:"5'9\"", reach:72, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'13-3-0', wins:13, losses:3, rank:null, p4p:null, color:'#0ea5e9',
    slpm:4.7, strAcc:48, tdAvg:1.2, tdAcc:40, subAvg:0.3,
    style:'Pressure Brawler', camp:'—', streak:'L1', notes:'Scottish lightweight; four-fight win streak snapped in this bout (record approximate).', last:'L SUB2 vs Moicano' },
  jandiroba: { id:'jandiroba', name:'Virna Jandiroba', nick:'Carcará', country:'🇧🇷', age:37,
    height:"5'4\"", reach:64, stance:'Southpaw', weight:"Women's Strawweight", division:'WSW',
    record:'22-3-0', wins:22, losses:3, rank:3, p4p:null, color:'#16a34a',
    slpm:3.0, strAcc:44, tdAvg:3.6, tdAcc:46, subAvg:2.0,
    style:'Elite Grappler', camp:'PRVT', streak:'W2', notes:'Top-ranked strawweight grappler (record approximate).', last:'W DEC vs Ricci' },
  ricci: { id:'ricci', name:'Tabatha Ricci', nick:'Baby Shark', country:'🇧🇷', age:30,
    height:"5'2\"", reach:62, stance:'Orthodox', weight:"Women's Strawweight", division:'WSW',
    record:'10-4-0', wins:10, losses:4, rank:9, p4p:null, color:'#dc2626',
    slpm:3.6, strAcc:46, tdAvg:2.8, tdAcc:44, subAvg:0.6,
    style:'Wrestle-Grappler', camp:'Sanford MMA', streak:'L1', notes:'Ranked Brazilian strawweight (record approximate).', last:'L DEC vs Jandiroba' },
  flowers: { id:'flowers', name:'Darrius Flowers', nick:'Beast Mode', country:'🇺🇸', age:33,
    height:"6'1\"", reach:76, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'13-7-1', wins:13, losses:7, rank:null, p4p:null, color:'#f59e0b',
    slpm:4.2, strAcc:48, tdAvg:0.8, tdAcc:36, subAvg:0.4,
    style:'Power Striker', camp:'—', streak:'W1', notes:'Hard-hitting American striker; first UFC win in this bout (record approximate).', last:'W KO2 vs Vannata' },
  vannata: { id:'vannata', name:'Lando Vannata', nick:'Groovy', country:'🇺🇸', age:33,
    height:"5'10\"", reach:72, stance:'Orthodox', weight:'Lightweight', division:'LW',
    record:'13-8-2', wins:13, losses:8, rank:null, p4p:null, color:'#a855f7',
    slpm:4.5, strAcc:46, tdAvg:0.6, tdAcc:32, subAvg:0.5,
    style:'Creative Striker', camp:'Jackson Wink', streak:'L1', notes:'Veteran American lightweight known for highlight strikes (record approximate).', last:'L KO2 vs Flowers' },

  // ─── MIDDLEWEIGHT ROSTER IMPORT (records cross-checked May 2026) ───
  imavov: { id:'imavov', name:'Nassourdine Imavov', nick:'—', country:'🇫🇷', age:30,
    height:"6'3\"", reach:76, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'17-4-0', wins:17, losses:4, rank:3, p4p:null, color:'#0ea5e9',
    slpm:4.3, strAcc:52, tdAvg:1.4, tdAcc:40, subAvg:0.4,
    style:'Technical Distance Striker', camp:'MMA Factory', streak:'W5', notes:'Surging top contender; recent wins over Adesanya and Borralho.', last:'W DEC vs Borralho' },
  duplessis: { id:'duplessis', name:'Dricus du Plessis', nick:'Stillknocks', country:'🇿🇦', age:32,
    height:"6'1\"", reach:77, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'23-3-0', wins:23, losses:3, rank:2, p4p:null, color:'#dc2626',
    slpm:4.6, strAcc:48, tdAvg:2.4, tdAcc:42, subAvg:0.8,
    style:'Awkward Pressure Finisher', camp:'CIT', streak:'W1', notes:'Former UFC middleweight champion.', last:'W' },
  borralho: { id:'borralho', name:'Caio Borralho', nick:'The Natural', country:'🇧🇷', age:32,
    height:"6'1\"", reach:75, stance:'Southpaw', weight:'Middleweight', division:'MW',
    record:'18-2-0', wins:18, losses:2, rank:4, p4p:null, color:'#16a34a',
    slpm:4.2, strAcc:53, tdAvg:2.2, tdAcc:44, subAvg:0.7,
    style:'Well-Rounded Pressure', camp:'Fighting Nerds', streak:'W1', notes:'Elite all-around middleweight contender.', last:'W DEC vs de Ridder' },
  pyfer: { id:'pyfer', name:'Joe Pyfer', nick:'Bodybagz', country:'🇺🇸', age:29,
    height:"6'2\"", reach:76, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'16-3-0', wins:16, losses:3, rank:7, p4p:null, color:'#f59e0b',
    slpm:4.3, strAcc:54, tdAvg:1.6, tdAcc:44, subAvg:0.6,
    style:'Explosive Power Finisher', camp:'Renzo Gracie Philly', streak:'W4', notes:'Hard-hitting riser; scored a knockout of Adesanya.', last:'W KO2 vs Adesanya' },
  fluffy: { id:'fluffy', name:'Anthony Hernandez', nick:'Fluffy', country:'🇺🇸', age:32,
    height:"6'1\"", reach:75, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'15-3-0', wins:15, losses:3, rank:6, p4p:null, color:'#a855f7',
    slpm:3.8, strAcc:49, tdAvg:3.4, tdAcc:46, subAvg:1.8,
    style:'Suffocating Grappler', camp:'CSW', streak:'W8', notes:'Relentless top-control grappler on a long win streak.', last:'W' },
  adesanya: { id:'adesanya', name:'Israel Adesanya', nick:'The Last Stylebender', country:'🇳🇬', age:36,
    height:"6'4\"", reach:80, stance:'Switch', weight:'Middleweight', division:'MW',
    record:'24-6-0', wins:24, losses:6, rank:9, p4p:null, color:'#dc2626',
    slpm:4.0, strAcc:50, tdAvg:0.1, tdAcc:25, subAvg:0.1,
    style:'Elite Kickboxer', camp:'City Kickboxing', streak:'L1', notes:'Former UFC middleweight champion and all-time great striker.', last:'L KO2 vs Pyfer' },
  deridder: { id:'deridder', name:'Reinier de Ridder', nick:'RDR', country:'🇳🇱', age:35,
    height:"6'4\"", reach:78, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'21-4-0', wins:21, losses:4, rank:8, p4p:null, color:'#0ea5e9',
    slpm:3.4, strAcc:47, tdAvg:3.0, tdAcc:44, subAvg:1.5,
    style:'Lanky Grappler', camp:'—', streak:'L1', notes:'Former two-division ONE champion; elite grappling.', last:'L DEC vs Borralho' },
  cannonier: { id:'cannonier', name:'Jared Cannonier', nick:'The Killa Gorilla', country:'🇺🇸', age:42,
    height:"5'11\"", reach:77, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'18-9-0', wins:18, losses:9, rank:11, p4p:null, color:'#f97316',
    slpm:4.1, strAcc:50, tdAvg:0.6, tdAcc:36, subAvg:0.2,
    style:'Heavy-Handed Power Puncher', camp:'MMA Lab', streak:'L1', notes:'Long-tenured power-punching contender.', last:'L' },
  grodrigues: { id:'grodrigues', name:'Gregory Rodrigues', nick:'Robocop', country:'🇧🇷', age:33,
    height:"6'1\"", reach:75, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'19-6-0', wins:19, losses:6, rank:12, p4p:null, color:'#16a34a',
    slpm:4.6, strAcc:50, tdAvg:1.8, tdAcc:42, subAvg:0.7,
    style:'Aggressive Brawler-Grappler', camp:'Sanford MMA', streak:'W2', notes:'All-action Brazilian middleweight.', last:'W' },
  clduncan: { id:'clduncan', name:'Christian Leroy Duncan', nick:'—', country:'🇬🇧', age:30,
    height:"6'3\"", reach:79, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'14-2-0', wins:14, losses:2, rank:13, p4p:null, color:'#3b82f6',
    slpm:4.4, strAcc:51, tdAvg:0.8, tdAcc:38, subAvg:0.4,
    style:'Rangy Athletic Striker', camp:'Team Renegade', streak:'W3', notes:'Rising British middleweight prospect.', last:'W' },
  dolidze: { id:'dolidze', name:'Roman Dolidze', nick:'—', country:'🇬🇪', age:37,
    height:"6'2\"", reach:76, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'14-3-0', wins:14, losses:3, rank:14, p4p:null, color:'#a855f7',
    slpm:3.6, strAcc:47, tdAvg:1.4, tdAcc:40, subAvg:0.8,
    style:'Grappler-Striker', camp:'—', streak:'W1', notes:'Georgian middleweight (record approximate).', last:'W' },
  smagomedov: { id:'smagomedov', name:'Shara Magomedov', nick:'Bullet', country:'🇷🇺', age:31,
    height:"6'2\"", reach:76, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'17-1-0', wins:17, losses:1, rank:null, p4p:null, color:'#0ea5e9',
    slpm:4.5, strAcc:53, tdAvg:0.4, tdAcc:33, subAvg:0.2,
    style:'Spinning-Strike Specialist', camp:'—', streak:'W1', notes:'Flashy striking prospect (record approximate).', last:'W' },
  moleksiejczuk: { id:'moleksiejczuk', name:'Michal Oleksiejczuk', nick:'—', country:'🇵🇱', age:31,
    height:"6'0\"", reach:74, stance:'Southpaw', weight:'Middleweight', division:'MW',
    record:'20-9-0', wins:20, losses:9, rank:null, p4p:null, color:'#f59e0b',
    slpm:4.2, strAcc:50, tdAvg:0.6, tdAcc:35, subAvg:0.3,
    style:'Power Southpaw', camp:'—', streak:'L1', notes:'Polish power striker (record approximate).', last:'L' },
  jpark: { id:'jpark', name:'Jun Yong Park', nick:'The Iron Turtle', country:'🇰🇷', age:34,
    height:"5'10\"", reach:73, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'19-7-0', wins:19, losses:7, rank:null, p4p:null, color:'#3b82f6',
    slpm:4.0, strAcc:48, tdAvg:2.6, tdAcc:44, subAvg:0.5,
    style:'Relentless Pressure', camp:'—', streak:'W1', notes:'Durable Korean middleweight (record approximate).', last:'W' },
  hermansson: { id:'hermansson', name:'Jack Hermansson', nick:'The Joker', country:'🇸🇪', age:37,
    height:"6'1\"", reach:77, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'24-9-0', wins:24, losses:9, rank:null, p4p:null, color:'#a855f7',
    slpm:3.8, strAcc:47, tdAvg:2.4, tdAcc:42, subAvg:0.9,
    style:'Grappler-Striker Veteran', camp:'—', streak:'W1', notes:'Long-tenured middleweight gatekeeper (record approximate).', last:'W' },
  curtis: { id:'curtis', name:'Chris Curtis', nick:'The Action Man', country:'🇺🇸', age:38,
    height:"5'11\"", reach:74, stance:'Southpaw', weight:'Middleweight', division:'MW',
    record:'32-12-0', wins:32, losses:12, rank:null, p4p:null, color:'#f97316',
    slpm:4.3, strAcc:49, tdAvg:0.3, tdAcc:30, subAvg:0.1,
    style:'Veteran Counter-Boxer', camp:'—', streak:'L1', notes:'Hard-nosed boxing veteran (record approximate).', last:'L' },
  mpereira: { id:'mpereira', name:'Michel Pereira', nick:'Demolidor', country:'🇧🇷', age:32,
    height:"6'1\"", reach:77, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'32-13-0', wins:32, losses:13, rank:null, p4p:null, color:'#dc2626',
    slpm:4.4, strAcc:52, tdAvg:1.8, tdAcc:42, subAvg:0.6,
    style:'Unpredictable Showman', camp:'—', streak:'W1', notes:'Acrobatic, unorthodox finisher (record approximate).', last:'W' },
  tavares: { id:'tavares', name:'Brad Tavares', nick:'—', country:'🇺🇸', age:38,
    height:"5'11\"", reach:74, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'20-10-0', wins:20, losses:10, rank:null, p4p:null, color:'#0ea5e9',
    slpm:3.6, strAcc:49, tdAvg:0.6, tdAcc:36, subAvg:0.1,
    style:'Technical Veteran Striker', camp:'—', streak:'L1', notes:'Long-time middleweight veteran (record approximate).', last:'L' },
  meerschaert: { id:'meerschaert', name:'Gerald Meerschaert', nick:'GM3', country:'🇺🇸', age:37,
    height:"6'1\"", reach:76, stance:'Southpaw', weight:'Middleweight', division:'MW',
    record:'37-19-0', wins:37, losses:19, rank:null, p4p:null, color:'#16a34a',
    slpm:3.4, strAcc:46, tdAvg:1.4, tdAcc:40, subAvg:2.4,
    style:'Submission Specialist', camp:'Roufusport', streak:'L1', notes:'Veteran submission artist (record approximate).', last:'L' },
  todorovic: { id:'todorovic', name:'Dusko Todorovic', nick:'—', country:'🇷🇸', age:31,
    height:"6'1\"", reach:74, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'12-5-0', wins:12, losses:5, rank:null, p4p:null, color:'#3b82f6',
    slpm:3.8, strAcc:48, tdAvg:1.6, tdAcc:40, subAvg:0.5,
    style:'Pressure Striker', camp:'—', streak:'W1', notes:'Serbian middleweight (record approximate).', last:'W' },
  stoltzfus: { id:'stoltzfus', name:'Dustin Stoltzfus', nick:'—', country:'🇺🇸', age:33,
    height:"6'1\"", reach:76, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'16-6-0', wins:16, losses:6, rank:null, p4p:null, color:'#f97316',
    slpm:3.2, strAcc:46, tdAvg:2.8, tdAcc:44, subAvg:0.8,
    style:'Grappler', camp:'—', streak:'L1', notes:'American grappler (record approximate).', last:'L' },
  barriault: { id:'barriault', name:'Marc-Andre Barriault', nick:'Power Bar', country:'🇨🇦', age:36,
    height:"6'0\"", reach:74, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'18-9-0', wins:18, losses:9, rank:null, p4p:null, color:'#dc2626',
    slpm:4.2, strAcc:48, tdAvg:1.0, tdAcc:38, subAvg:0.4,
    style:'Aggressive Striker', camp:'—', streak:'W1', notes:'Canadian pressure striker (record approximate).', last:'W' },
  rvieira: { id:'rvieira', name:'Rodolfo Vieira', nick:'The Black Belt Hunter', country:'🇧🇷', age:36,
    height:"6'0\"", reach:75, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'14-3-0', wins:14, losses:3, rank:null, p4p:null, color:'#16a34a',
    slpm:2.6, strAcc:46, tdAvg:3.6, tdAcc:50, subAvg:2.6,
    style:'Elite BJJ Grappler', camp:'—', streak:'W1', notes:'Decorated jiu-jitsu world champion (record approximate).', last:'W' },
  amagomedov: { id:'amagomedov', name:'Abus Magomedov', nick:'—', country:'🇩🇪', age:35,
    height:"6'1\"", reach:75, stance:'Orthodox', weight:'Middleweight', division:'MW',
    record:'27-7-1', wins:27, losses:7, rank:null, p4p:null, color:'#0ea5e9',
    slpm:4.4, strAcc:50, tdAvg:1.0, tdAcc:38, subAvg:0.5,
    style:'KO Striker', camp:'—', streak:'W1', notes:'Hard-hitting German-Dagestani middleweight (record approximate).', last:'W' },
  usman: { id:'usman', name:'Kamaru Usman', nick:'The Nigerian Nightmare', country:'🇳🇬', age:38,
    height:"6'0\"", reach:76, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'21-4-0', wins:21, losses:4, rank:8, p4p:null, color:'#dc2626',
    slpm:4.0, strAcc:52, tdAvg:3.0, tdAcc:45, subAvg:0.3,
    style:'Elite Wrestle-Boxer', camp:'UFC PI', streak:'W1', notes:'Former UFC welterweight champion (record approximate).', last:'L' },
  mvp: { id:'mvp', name:'Michael Page', nick:'Venom', country:'🇬🇧', age:38,
    height:"6'3\"", reach:80, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'25-3-0', wins:25, losses:3, rank:13, p4p:null, color:'#a855f7',
    slpm:4.0, strAcc:55, tdAvg:0.2, tdAcc:30, subAvg:0.1,
    style:'Flashy Distance Striker', camp:'London Shootfighters', streak:'W1', notes:'Showboating striking specialist (record approximate).', last:'W' },

  // ─── WELTERWEIGHT ROSTER IMPORT (records cross-checked May 2026) ───
  igarry: { id:'igarry', name:'Ian Machado Garry', nick:'The Future', country:'🇮🇪', age:28,
    height:"6'3\"", reach:74, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'17-1-0', wins:17, losses:1, rank:1, p4p:null, color:'#16a34a',
    slpm:4.6, strAcc:54, tdAvg:0.8, tdAcc:38, subAvg:0.3,
    style:'Rangy Technical Striker', camp:'Kill Cliff FC', streak:'W1', notes:'Top welterweight contender; long-range striking.', last:'W' },
  mmorales: { id:'mmorales', name:'Michael Morales', nick:'—', country:'🇪🇨', age:26,
    height:"6'1\"", reach:78, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'19-0-0', wins:19, losses:0, rank:3, p4p:null, color:'#dc2626',
    slpm:4.5, strAcc:56, tdAvg:1.6, tdAcc:46, subAvg:0.4,
    style:'Composed Power Striker', camp:'Entram Gym', streak:'W19', notes:'Undefeated Ecuadorian contender.', last:'W' },
  sbrady: { id:'sbrady', name:'Sean Brady', nick:'—', country:'🇺🇸', age:33,
    height:"5'10\"", reach:72, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'19-2-0', wins:19, losses:2, rank:6, p4p:null, color:'#0ea5e9',
    slpm:4.0, strAcc:50, tdAvg:3.4, tdAcc:46, subAvg:0.9,
    style:'Pressure Wrestle-Grappler', camp:'Renzo Gracie Philly', streak:'W1', notes:'Grappling-heavy top contender.', last:'W' },
  ledwards: { id:'ledwards', name:'Leon Edwards', nick:'Rocky', country:'🇬🇧', age:34,
    height:"6'0\"", reach:74, stance:'Southpaw', weight:'Welterweight', division:'WW',
    record:'22-6-0', wins:22, losses:6, rank:7, p4p:null, color:'#f59e0b',
    slpm:3.6, strAcc:51, tdAvg:1.6, tdAcc:42, subAvg:0.5,
    style:'Technical Southpaw', camp:'Team Renegade', streak:'L1', notes:'Former UFC welterweight champion.', last:'L' },
  buckley: { id:'buckley', name:'Joaquin Buckley', nick:'New Mansa', country:'🇺🇸', age:32,
    height:"5'10\"", reach:73, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'21-8-0', wins:21, losses:8, rank:9, p4p:null, color:'#a855f7',
    slpm:4.3, strAcc:50, tdAvg:1.0, tdAcc:38, subAvg:0.4,
    style:'Explosive KO Striker', camp:'—', streak:'L1', notes:'Highlight-reel finisher.', last:'L' },
  amosov: { id:'amosov', name:'Yaroslav Amosov', nick:'—', country:'🇺🇦', age:32,
    height:"5'10\"", reach:73, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'30-1-0', wins:30, losses:1, rank:10, p4p:null, color:'#16a34a',
    slpm:3.4, strAcc:48, tdAvg:3.8, tdAcc:48, subAvg:0.8,
    style:'Relentless Grappler', camp:'—', streak:'W1', notes:'Former Bellator welterweight champion (record approximate).', last:'W' },
  umedic: { id:'umedic', name:'Uros Medic', nick:'Doctor', country:'🇷🇸', age:32,
    height:"6'0\"", reach:75, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'13-3-0', wins:13, losses:3, rank:14, p4p:null, color:'#dc2626',
    slpm:4.4, strAcc:52, tdAvg:0.6, tdAcc:35, subAvg:0.5,
    style:'Aggressive Finisher', camp:'—', streak:'W1', notes:'Hard-hitting Serbian welterweight.', last:'W' },
  drodriguez: { id:'drodriguez', name:'Daniel Rodriguez', nick:'D-Rod', country:'🇺🇸', age:39,
    height:"5'11\"", reach:74, stance:'Southpaw', weight:'Welterweight', division:'WW',
    record:'20-5-0', wins:20, losses:5, rank:15, p4p:null, color:'#0ea5e9',
    slpm:4.5, strAcc:52, tdAvg:0.6, tdAcc:34, subAvg:0.2,
    style:'Volume Boxer', camp:'—', streak:'W1', notes:'Pressure boxing veteran (record approximate).', last:'W' },
  rakhmonov: { id:'rakhmonov', name:'Shavkat Rakhmonov', nick:'Nomad', country:'🇰🇿', age:31,
    height:"6'1\"", reach:77, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'19-0-0', wins:19, losses:0, rank:null, p4p:null, color:'#f59e0b',
    slpm:4.0, strAcc:53, tdAvg:3.0, tdAcc:48, subAvg:1.4,
    style:'Finisher — Strikes & Subs', camp:'—', streak:'W19', notes:'Undefeated finisher; recently inactive (record approximate).', last:'W' },
  thompson: { id:'thompson', name:'Stephen Thompson', nick:'Wonderboy', country:'🇺🇸', age:43,
    height:"6'0\"", reach:75, stance:'Switch', weight:'Welterweight', division:'WW',
    record:'17-8-1', wins:17, losses:8, rank:null, p4p:null, color:'#a855f7',
    slpm:4.2, strAcc:50, tdAvg:0.2, tdAcc:28, subAvg:0.1,
    style:'Karate Point Striker', camp:'Upstate Karate', streak:'L1', notes:'Karate-based striking legend (record approximate).', last:'L' },
  magny: { id:'magny', name:'Neil Magny', nick:'The Haitian Sensation', country:'🇺🇸', age:38,
    height:"6'3\"", reach:80, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'29-13-0', wins:29, losses:13, rank:null, p4p:null, color:'#16a34a',
    slpm:3.8, strAcc:48, tdAvg:2.0, tdAcc:42, subAvg:0.4,
    style:'Long Volume Striker', camp:'Elevation Fight Team', streak:'W1', notes:'Durable welterweight veteran (record approximate).', last:'W' },
  gneal: { id:'gneal', name:'Geoff Neal', nick:'Handz of Steel', country:'🇺🇸', age:35,
    height:"5'11\"", reach:75, stance:'Southpaw', weight:'Welterweight', division:'WW',
    record:'16-7-0', wins:16, losses:7, rank:null, p4p:null, color:'#dc2626',
    slpm:4.6, strAcc:51, tdAvg:0.3, tdAcc:30, subAvg:0.2,
    style:'Power Southpaw Boxer', camp:'Fortis MMA', streak:'L1', notes:'Heavy-handed boxer (record approximate).', last:'L' },
  rda: { id:'rda', name:'Rafael dos Anjos', nick:'RDA', country:'🇧🇷', age:41,
    height:"5'8\"", reach:70, stance:'Southpaw', weight:'Welterweight', division:'WW',
    record:'32-16-0', wins:32, losses:16, rank:null, p4p:null, color:'#0ea5e9',
    slpm:3.6, strAcc:46, tdAvg:2.4, tdAcc:42, subAvg:0.7,
    style:'Pressure Muay Thai-Grappler', camp:'Kings MMA', streak:'L1', notes:'Former UFC lightweight champion (record approximate).', last:'L' },
  mcgregor: { id:'mcgregor', name:'Conor McGregor', nick:'The Notorious', country:'🇮🇪', age:37,
    height:"5'9\"", reach:74, stance:'Southpaw', weight:'Welterweight', division:'WW',
    record:'22-6-0', wins:22, losses:6, rank:null, p4p:null, color:'#16a34a',
    slpm:5.3, strAcc:49, tdAvg:0.7, tdAcc:33, subAvg:0.1,
    style:'Power Southpaw Counter-Striker', camp:'SBG Ireland', streak:'L1', notes:'Former two-division UFC champion; long inactive (record approximate).', last:'L' },
  gnelson: { id:'gnelson', name:'Gunnar Nelson', nick:'Gunni', country:'🇮🇸', age:37,
    height:"5'11\"", reach:72, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'19-5-1', wins:19, losses:5, rank:null, p4p:null, color:'#f59e0b',
    slpm:2.8, strAcc:48, tdAvg:2.2, tdAcc:46, subAvg:1.6,
    style:'Elite Karate-Grappler', camp:'Mjölnir', streak:'W1', notes:'Karate-and-jiu-jitsu specialist (record approximate).', last:'W' },
  lijingliang: { id:'lijingliang', name:'Li Jingliang', nick:'The Leech', country:'🇨🇳', age:37,
    height:"5'10\"", reach:74, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'20-9-0', wins:20, losses:9, rank:null, p4p:null, color:'#dc2626',
    slpm:4.2, strAcc:49, tdAvg:1.4, tdAcc:40, subAvg:0.4,
    style:'Aggressive Brawler', camp:'—', streak:'W1', notes:'All-action Chinese welterweight (record approximate).', last:'W' },
  ponzinibbio: { id:'ponzinibbio', name:'Santiago Ponzinibbio', nick:'Gente Boa', country:'🇦🇷', age:39,
    height:"5'11\"", reach:73, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'30-8-0', wins:30, losses:8, rank:null, p4p:null, color:'#0ea5e9',
    slpm:4.4, strAcc:50, tdAvg:0.5, tdAcc:33, subAvg:0.2,
    style:'Pressure Power Striker', camp:'—', streak:'W1', notes:'Veteran Argentine striker (record approximate).', last:'W' },
  njokuani: { id:'njokuani', name:'Chidi Njokuani', nick:'Chidi Bang Bang', country:'🇺🇸', age:37,
    height:"6'3\"", reach:78, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'23-9-0', wins:23, losses:9, rank:null, p4p:null, color:'#a855f7',
    slpm:4.3, strAcc:51, tdAvg:0.4, tdAcc:32, subAvg:0.2,
    style:'Long Rangy Striker', camp:'—', streak:'W1', notes:'Rangy striking specialist (record approximate).', last:'W' },
  tmeans: { id:'tmeans', name:'Tim Means', nick:'The Dirty Bird', country:'🇺🇸', age:42,
    height:"6'2\"", reach:76, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'34-17-1', wins:34, losses:17, rank:null, p4p:null, color:'#16a34a',
    slpm:4.0, strAcc:48, tdAvg:1.0, tdAcc:38, subAvg:0.5,
    style:'Veteran Clinch Striker', camp:'Fit NHB', streak:'W1', notes:'Long-tenured welterweight veteran (record approximate).', last:'W' },
  soriano: { id:'soriano', name:'Punahele Soriano', nick:'Story Time', country:'🇺🇸', age:33,
    height:"5'10\"", reach:74, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'10-5-0', wins:10, losses:5, rank:null, p4p:null, color:'#dc2626',
    slpm:3.8, strAcc:49, tdAvg:1.2, tdAcc:38, subAvg:0.3,
    style:'Power Striker', camp:'—', streak:'L1', notes:'Hawaiian power puncher (record approximate).', last:'L' },
  dalby: { id:'dalby', name:'Nicolas Dalby', nick:'Shark', country:'🇩🇰', age:41,
    height:"6'0\"", reach:74, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'23-6-1', wins:23, losses:6, rank:null, p4p:null, color:'#0ea5e9',
    slpm:3.8, strAcc:48, tdAvg:1.4, tdAcc:40, subAvg:0.5,
    style:'Well-Rounded Veteran', camp:'—', streak:'W1', notes:'Experienced Danish welterweight (record approximate).', last:'W' },
  cmcgee: { id:'cmcgee', name:'Court McGee', nick:'The Crusher', country:'🇺🇸', age:41,
    height:"6'0\"", reach:75, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'23-13-0', wins:23, losses:13, rank:null, p4p:null, color:'#f59e0b',
    slpm:3.6, strAcc:46, tdAvg:1.6, tdAcc:40, subAvg:0.3,
    style:'High-Pace Grinder', camp:'—', streak:'L1', notes:'Durable TUF-winning veteran (record approximate).', last:'L' },
  mgriffin: { id:'mgriffin', name:'Max Griffin', nick:'Pain', country:'🇺🇸', age:39,
    height:"5'11\"", reach:76, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'20-12-0', wins:20, losses:12, rank:null, p4p:null, color:'#a855f7',
    slpm:4.1, strAcc:49, tdAvg:0.8, tdAcc:36, subAvg:0.2,
    style:'Tough Power Striker', camp:'—', streak:'W1', notes:'Hard-nosed welterweight veteran (record approximate).', last:'W' },
  orolbai: { id:'orolbai', name:'Myktybek Orolbai', nick:'—', country:'🇰🇬', age:31,
    height:"5'10\"", reach:73, stance:'Southpaw', weight:'Welterweight', division:'WW',
    record:'13-2-1', wins:13, losses:2, rank:null, p4p:null, color:'#16a34a',
    slpm:3.8, strAcc:50, tdAvg:3.2, tdAcc:46, subAvg:1.0,
    style:'Aggressive Wrestle-Grappler', camp:'—', streak:'W1', notes:'Kyrgyz wrestle-grappler (record approximate).', last:'W' },
  jalvarez: { id:'jalvarez', name:'Joel Alvarez', nick:'El Fenómeno', country:'🇪🇸', age:32,
    height:"6'3\"", reach:76, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'22-3-0', wins:22, losses:3, rank:null, p4p:null, color:'#dc2626',
    slpm:4.0, strAcc:50, tdAvg:0.6, tdAcc:34, subAvg:2.0,
    style:'Lanky Submission Striker', camp:'—', streak:'W1', notes:'Tall Spanish finisher (record approximate).', last:'W' },
  gorimbo: { id:'gorimbo', name:'Themba Gorimbo', nick:'The River', country:'🇿🇼', age:34,
    height:"5'10\"", reach:73, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'13-5-0', wins:13, losses:5, rank:null, p4p:null, color:'#0ea5e9',
    slpm:3.6, strAcc:47, tdAvg:2.4, tdAcc:42, subAvg:0.8,
    style:'Grappler', camp:'MMA Masters', streak:'W1', notes:'Zimbabwean welterweight (record approximate).', last:'W' },
  songkenan: { id:'songkenan', name:'Song Kenan', nick:'Kung Fu Monkey', country:'🇨🇳', age:33,
    height:"5'11\"", reach:75, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'22-8-0', wins:22, losses:8, rank:null, p4p:null, color:'#f59e0b',
    slpm:4.3, strAcc:51, tdAvg:0.4, tdAcc:32, subAvg:0.2,
    style:'KO Striker', camp:'—', streak:'W1', notes:'Chinese knockout artist (record approximate).', last:'W' },
  oelliott: { id:'oelliott', name:'Oban Elliott', nick:'The Welsh Gangster', country:'🏴󠁧󠁢󠁷󠁬󠁳󠁿', age:28,
    height:"5'11\"", reach:74, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'12-2-0', wins:12, losses:2, rank:null, p4p:null, color:'#a855f7',
    slpm:4.4, strAcc:50, tdAvg:1.4, tdAcc:40, subAvg:0.4,
    style:'Aggressive Striker', camp:'—', streak:'W1', notes:'Welsh welterweight prospect (record approximate).', last:'W' },
  ggreen: { id:'ggreen', name:'Gabe Green', nick:'Gifted', country:'🇺🇸', age:31,
    height:"5'11\"", reach:74, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'12-5-0', wins:12, losses:5, rank:null, p4p:null, color:'#16a34a',
    slpm:4.2, strAcc:49, tdAvg:1.0, tdAcc:38, subAvg:0.3,
    style:'Volume Striker', camp:'—', streak:'W1', notes:'American welterweight (record approximate).', last:'W' },
  cradtke: { id:'cradtke', name:'Charles Radtke', nick:'Chuck Buffalo', country:'🇺🇸', age:33,
    height:"5'11\"", reach:74, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'12-5-0', wins:12, losses:5, rank:null, p4p:null, color:'#dc2626',
    slpm:4.1, strAcc:48, tdAvg:0.8, tdAcc:36, subAvg:0.3,
    style:'Aggressive Striker', camp:'—', streak:'W1', notes:'American welterweight (record approximate).', last:'W' },
  charris: { id:'charris', name:'Carlston Harris', nick:'Moçambique', country:'🇬🇾', age:38,
    height:"5'11\"", reach:75, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'19-6-0', wins:19, losses:6, rank:null, p4p:null, color:'#0ea5e9',
    slpm:3.8, strAcc:49, tdAvg:1.6, tdAcc:42, subAvg:1.2,
    style:'Submission Grappler', camp:'—', streak:'W1', notes:'Guyanese grappler (record approximate).', last:'W' },
  brahimaj: { id:'brahimaj', name:'Ramiz Brahimaj', nick:'—', country:'🇽🇰', age:33,
    height:"5'11\"", reach:75, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'11-5-0', wins:11, losses:5, rank:null, p4p:null, color:'#f59e0b',
    slpm:3.4, strAcc:46, tdAvg:2.2, tdAcc:42, subAvg:1.6,
    style:'Submission Grappler', camp:'—', streak:'L1', notes:'Kosovar-American grappler (record approximate).', last:'L' },
  jwells: { id:'jwells', name:'Jeremiah Wells', nick:'Wolfman', country:'🇺🇸', age:38,
    height:"5'10\"", reach:75, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'12-4-1', wins:12, losses:4, rank:null, p4p:null, color:'#a855f7',
    slpm:3.8, strAcc:49, tdAvg:1.2, tdAcc:40, subAvg:0.6,
    style:'Power Grappler', camp:'—', streak:'W1', notes:'American welterweight (record approximate).', last:'W' },
  izagakhmaev: { id:'izagakhmaev', name:'Saygid Izagakhmaev', nick:'—', country:'🇷🇺', age:33,
    height:"5'10\"", reach:73, stance:'Orthodox', weight:'Welterweight', division:'WW',
    record:'22-3-1', wins:22, losses:3, rank:null, p4p:null, color:'#16a34a',
    slpm:3.6, strAcc:48, tdAvg:3.4, tdAcc:46, subAvg:1.3,
    style:'Dagestani Wrestle-Grappler', camp:'—', streak:'W1', notes:'Dagestani grappler (record approximate).', last:'W' },
};

const f = (id) => FIGHTERS[id];

// ═══════════════════════════════════════════════════════════════════════
// REAL UPCOMING EVENTS — 7 cards (UFC.com / ESPN / Tapology / MVP)
// ═══════════════════════════════════════════════════════════════════════

const EVENTS = [
  {
    id:'ufc-song-figgy', org:'UFC', name:'UFC Fight Night 277', subtitle:'SONG vs FIGUEIREDO',
    date:'Sat, May 30, 2026', dateISO:'2026-05-30T08:00:00', venue:'Galaxy Arena',
    city:'Macau, China', country:'🇨🇳', broadcast:'Paramount+', isPPV:false, banner:'#3b1e5f',
    card:[
      { f1:'song', f2:'figgy', division:'Bantamweight', rounds:5, slot:'Main Event', odds:{f1:-135,f2:115} },
      { f1:'zhangmy', f2:'menifield', division:'Light Heavyweight', rounds:3, slot:'Co-Main Event', odds:null },
      { f1:'pavlovich', f2:'tteixeira', division:'Heavyweight', rounds:3, slot:'Main Card', odds:null },
      { f1:'aperez', f2:'sumudaerji', division:'Flyweight', rounds:3, slot:'Main Card', odds:null },
      { f1:'asakura', f2:'smotherman', division:'Bantamweight', rounds:3, slot:'Main Card', odds:null },
    ],
    prelimCard:[
      { f1:'salikhov', f2:'jmatthews', division:'Welterweight', rounds:3, slot:'Featured Prelim', odds:null },
      { f1:'haddon', f2:'aoriqileng', division:'Bantamweight', rounds:3, slot:'Prelim', odds:null },
      { f1:'xiong', f2:'ahill', division:"Women's Strawweight", rounds:3, slot:'Prelim', odds:null },
      { f1:'tsuruya', f2:'jaguilar', division:'Flyweight', rounds:3, slot:'Prelim', odds:null },
      { f1:'loma', f2:'jamorim', division:"Women's Strawweight", rounds:3, slot:'Early Prelim', odds:null },
      { f1:'zhukj', f2:'rtaveras', division:'Featherweight', rounds:3, slot:'Early Prelim', odds:null },
      { f1:'dingm', f2:'jhsouza', division:'Welterweight', rounds:3, slot:'Early Prelim', odds:null },
      { f1:'lfdias', f2:'yslee', division:'Middleweight', rounds:3, slot:'Early Prelim', odds:null },
    ],
    note:'UFC returns to Macau for the fifth time, the first of a multi-year Galaxy Arena partnership. A ranked bantamweight headliner with divisional stakes.',
  },
  {
    id:'ufc-belal-bonfim', org:'UFC', name:'UFC Fight Night 278', subtitle:'MUHAMMAD vs BONFIM',
    date:'Sat, Jun 6, 2026', dateISO:'2026-06-06T20:00:00', venue:'Meta APEX',
    city:'Las Vegas, NV', country:'🇺🇸', broadcast:'Paramount+', isPPV:false, banner:'#1e4035',
    card:[
      { f1:'belal', f2:'bonfim', division:'Welterweight', rounds:5, slot:'Main Event', odds:{f1:-210,f2:175} },
      { f1:'ballen', f2:'shahbazyan', division:'Middleweight', rounds:3, slot:'Co-Main Event', odds:null },
      { f1:'bmitchell', f2:'vhenry', division:'Bantamweight', rounds:3, slot:'Main Card', odds:null },
      { f1:'ziam', f2:'tnolan', division:'Lightweight', rounds:3, slot:'Main Card', odds:null },
      { f1:'brunosilva', f2:'chairez', division:'Flyweight', rounds:3, slot:'Main Card', odds:null },
    ],
    prelimCard:[
      { f1:'baraniewski', f2:'elekana', division:'Light Heavyweight', rounds:3, slot:'Featured Prelim', odds:null },
      { f1:'irodriguez', f2:'schnell', division:'Flyweight', rounds:3, slot:'Prelim', odds:null },
      { f1:'mcghee', f2:'wiklacz', division:'Bantamweight', rounds:3, slot:'Prelim', odds:null },
      { f1:'leavitt', f2:'jbrito', division:'Lightweight', rounds:3, slot:'Prelim', odds:null },
      { f1:'ksouza', f2:'carnelossi', division:"Women's Strawweight", rounds:3, slot:'Early Prelim', odds:null },
      { f1:'cachoeira', f2:'cchandler', division:"Women's Flyweight", rounds:3, slot:'Early Prelim', odds:null },
      { f1:'jchaves', f2:'duben', division:"Women's Flyweight", rounds:3, slot:'Early Prelim', odds:null },
    ],
    note:'The final UFC card before Freedom 250 at the White House. Former welterweight champ Belal Muhammad faces surging finisher Gabriel Bonfim with title-picture stakes.',
  },
  {
    id:'ufc-freedom-250', org:'UFC', name:'UFC FREEDOM 250', subtitle:'TOPURIA vs GAETHJE',
    date:'Sun, Jun 14, 2026', dateISO:'2026-06-14T20:00:00', venue:'South Lawn, The White House',
    city:'Washington, D.C.', country:'🇺🇸', broadcast:'Paramount+ / CBS', isPPV:true, historic:true,
    banner:'#5f1e1e',
    card:[
      { f1:'topuria', f2:'gaethje', division:'Lightweight', titleFight:true, rounds:5, slot:'Main Event',
        odds:{f1:-1000,f2:525} },
      { f1:'pereira', f2:'gane', division:'Heavyweight · Interim Title', titleFight:true, rounds:5, slot:'Co-Main Event',
        odds:{f1:-115,f2:-105} },
      { f1:'omalley', f2:'zahabi', division:'Bantamweight', rounds:3, slot:'Main Card', odds:{f1:-500,f2:325} },
      { f1:'ruffy', f2:'chandler', division:'Lightweight', rounds:3, slot:'Main Card', odds:null },
      { f1:'nickal', f2:'daukaus', division:'Middleweight', rounds:3, slot:'Main Card', odds:null },
      { f1:'dlopes', f2:'sgarcia', division:'Featherweight', rounds:3, slot:'Main Card', odds:null },
    ],
    prelimCard:[
      { f1:'dlewis', f2:'hokit', division:'Heavyweight', rounds:3, slot:'Featured Prelim', odds:null },
    ],
    note:'The first professional sporting event ever held on White House grounds — a compact, marquee seven-fight card. ~4,300 seated (mostly military); 85,000 free tickets for the Ellipse viewing area.',
  },
  {
    id:'ufc-kape-horiguchi', org:'UFC', name:'UFC Fight Night 279', subtitle:'KAPE vs HORIGUCHI',
    date:'Sat, Jun 20, 2026', dateISO:'2026-06-20T20:00:00', venue:'Meta APEX',
    city:'Las Vegas, NV', country:'🇺🇸', broadcast:'Paramount+', isPPV:false, banner:'#1e3a5f',
    card:[
      { f1:'kape', f2:'horiguchi', division:'Flyweight', rounds:5, slot:'Main Event', titleImpact:true, odds:{f1:-185,f2:155} },
      { f1:'cutelaba', f2:'stirling', division:'Light Heavyweight', rounds:3, slot:'Co-Main Event', odds:null },
      { f1:'krosa', f2:'lsantos', division:"Women's Bantamweight", rounds:3, slot:'Main Card', odds:null },
      { f1:'hamil', f2:'crodriguez', division:'Featherweight', rounds:3, slot:'Main Card', odds:null },
      { f1:'diniz', f2:'joseluiz', division:'Heavyweight', rounds:3, slot:'Main Card', odds:null },
      { f1:'alima', f2:'kborjas', division:'Flyweight', rounds:3, slot:'Main Card', odds:null },
    ],
    prelimCard:[
      { f1:'mesquita', f2:'mullins', division:"Women's Bantamweight", rounds:3, slot:'Featured Prelim', odds:null },
      { f1:'raposo', f2:'anascimento', division:'Flyweight', rounds:3, slot:'Prelim', odds:null },
    ],
    note:'A flyweight rematch nine years in the making — #2 Manel Kape looks to avenge a 2017 RIZIN loss to #5 Kyoji Horiguchi with a title shot on the line. Additional prelims to be confirmed.',
  },
  {
    id:'ufc-fiziev-torres', org:'UFC', name:'UFC Fight Night 280', subtitle:'FIZIEV vs TORRES',
    date:'Sat, Jun 27, 2026', dateISO:'2026-06-27T15:00:00', venue:'National Gymnastics Arena',
    city:'Baku, Azerbaijan', country:'🇦🇿', broadcast:'Paramount+', isPPV:false, banner:'#1e4035',
    card:[
      { f1:'fiziev', f2:'torres', division:'Lightweight', rounds:5, slot:'Main Event', odds:{f1:-140,f2:120} },
      { f1:'sharamg', f2:'michelp', division:'Middleweight', rounds:3, slot:'Co-Main Event', odds:null },
      { f1:'vettori', f2:'naurdiev', division:'Middleweight', rounds:3, slot:'Main Card', odds:null },
      { f1:'bferreira', f2:'aliskerov', division:'Middleweight', rounds:3, slot:'Main Card', odds:null },
      { f1:'almabayev', f2:'cjohnson', division:'Flyweight', rounds:3, slot:'Main Card', odds:null },
      { f1:'oleksiejczuk', f2:'abusmag', division:'Middleweight', rounds:3, slot:'Main Card', odds:null },
    ],
    prelimCard:[
      { f1:'kuniev', f2:'fortune', division:'Heavyweight', rounds:3, slot:'Featured Prelim', odds:null },
      { f1:'ruziboev', f2:'pulyaev', division:'Middleweight', rounds:3, slot:'Prelim', odds:null },
      { f1:'jwalker', f2:'yakhyaev', division:'Light Heavyweight', rounds:3, slot:'Prelim', odds:null },
      { f1:'almakhan', f2:'matsumoto', division:'Bantamweight', rounds:3, slot:'Prelim', odds:null },
      { f1:'donchenko', f2:'agust', division:'Welterweight', rounds:3, slot:'Early Prelim', odds:null },
      { f1:'sadykhov', f2:'mcamilo', division:'Lightweight', rounds:3, slot:'Early Prelim', odds:null },
    ],
    note:"UFC's second visit to Azerbaijan, headlined by an explosive lightweight striker showdown. Hometown favorite Rafael Fiziev faces Mexico's first-round finishing machine Manuel Torres.",
  },
];

// Past events with REAL results — the backtest applies the live prediction
// engine to each of these fights. Results are real; predictions are computed.
const PAST_EVENTS = [
  {
    id:'mvp-1', name:'MVP MMA 1', subtitle:'ROUSEY vs CARANO', date:'May 16, 2026',
    venue:'Intuit Dome', city:'Inglewood, CA', banner:'#4c0f1a',
    card:[
      { f1:'rousey', f2:'carano', division:"Women's Featherweight", odds:{f1:-190,f2:160},
        result:{ winner:'rousey', method:'Submission', round:1, time:'0:17' } },
      { f1:'ndiaz', f2:'perry', division:'Welterweight', odds:{f1:115,f2:-135},
        result:{ winner:'perry', method:'KO/TKO', round:2, time:'5:00' } },
      { f1:'ngannou', f2:'lins', division:'Heavyweight', odds:{f1:-650,f2:450},
        result:{ winner:'ngannou', method:'KO/TKO', round:1, time:'4:31' } },
      { f1:'parnasse', f2:'kcross', division:'Lightweight', odds:null,
        result:{ winner:'parnasse', method:'KO/TKO', round:1, time:'4:18' } },
      { f1:'jds', f2:'despaigne', division:'Heavyweight', odds:null,
        result:{ winner:'despaigne', method:'KO/TKO', round:1, time:'2:59' } },
      { f1:'fazil', f2:'babian', division:'Welterweight', odds:null,
        result:{ winner:'fazil', method:'Submission', round:2, time:'0:58' } },
      { f1:'amoraes', f2:'nkuta', division:'Catchweight 130', odds:null,
        result:{ winner:'amoraes', method:'Submission', round:3, time:'4:49' } },
      { f1:'jjackson', f2:'creighton', division:'Welterweight', odds:null,
        result:{ winner:'jjackson', method:'KO/TKO', round:1, time:'0:22' } },
      { f1:'mgoyan', f2:'morales', division:'Featherweight', odds:null,
        result:{ winner:'mgoyan', method:'Decision', round:3, time:'5:00' } },
      { f1:'apereira', f2:'massonwong', division:"Women's Flyweight", odds:null,
        result:{ winner:'apereira', method:'Decision', round:3, time:'5:00' } },
    ],
  },
  {
    id:'ufc-allen-costa', name:'UFC Fight Night', subtitle:'ALLEN vs COSTA', date:'May 16, 2026',
    venue:'Meta APEX', city:'Las Vegas, NV', banner:'#10243a',
    card:[
      { f1:'allen', f2:'costa', division:'Featherweight · Main Event', odds:{f1:-188,f2:146},
        result:{ winner:'allen', method:'Decision', round:5, time:'5:00' } },
      { f1:'choi', f2:'dsantos', division:'Featherweight', odds:{f1:118,f2:-150},
        result:{ winner:'choi', method:'KO/TKO', round:2, time:'4:29' } },
      { f1:'wellmaker', f2:'jdiaz', division:'Bantamweight', odds:{f1:-280,f2:210},
        result:{ winner:'jdiaz', method:'Submission', round:2, time:'4:08' } },
      { f1:'bukauskas', f2:'cedwards', division:'Light Heavyweight', odds:{f1:-330,f2:250},
        result:{ winner:'bukauskas', method:'Decision', round:3, time:'5:00' } },
      { f1:'cuamba', f2:'sopaj', division:'Bantamweight', odds:{f1:134,f2:-172},
        result:{ winner:'sopaj', method:'Submission', round:2, time:'2:25' } },
      { f1:'veretennikov', f2:'khaos', division:'Welterweight', odds:{f1:145,f2:-175},
        result:{ winner:'khaos', method:'KO/TKO', round:1, time:'3:31' } },
      { f1:'erslan', f2:'tokkos', division:'Light Heavyweight', odds:null,
        result:{ winner:'erslan', method:'Decision', round:3, time:'5:00' } },
      { f1:'gantt', f2:'minev', division:'Lightweight', odds:null,
        result:{ winner:'gantt', method:'KO/TKO', round:2, time:'2:51' } },
      { f1:'vieira', f2:'cavalcanti', division:"Women's Bantamweight", odds:null,
        result:{ winner:'vieira', method:'Decision', round:3, time:'5:00' } },
      { f1:'petroski', f2:'brundage', division:'Middleweight', odds:null,
        result:{ winner:'brundage', method:'KO/TKO', round:2, time:'0:44' } },
      { f1:'ardelean', f2:'viana', division:"Women's Strawweight", odds:null,
        result:{ winner:'ardelean', method:'Submission', round:2, time:'4:36' } },
      { f1:'gurule', f2:'barez', division:'Flyweight', odds:null,
        result:{ winner:'gurule', method:'Decision', round:3, time:'5:00' } },
      { f1:'caliari', f2:'bannon', division:"Women's Strawweight", odds:null,
        result:{ winner:'caliari', method:'Submission', round:3, time:'3:08' } },
    ],
  },
  {
    id:'ufc-328', name:'UFC 328', subtitle:'CHIMAEV vs STRICKLAND', date:'May 9, 2026',
    venue:'Prudential Center', city:'Newark, NJ', banner:'#3b1d1d',
    card:[
      { f1:'chimaev', f2:'strickland', division:'Middleweight · Title', odds:{f1:-360,f2:290},
        result:{ winner:'strickland', method:'Decision', round:5, time:'5:00' } },
      { f1:'josvan', f2:'taira', division:'Flyweight · Title', odds:{f1:-150,f2:130},
        result:{ winner:'josvan', method:'KO/TKO', round:5, time:'1:32' } },
      { f1:'gautier', f2:'odiaz', division:'Middleweight', odds:null,
        result:{ winner:'gautier', method:'KO/TKO', round:2, time:'1:40' } },
      { f1:'susurkaev', f2:'djsantos', division:'Middleweight', odds:null,
        result:{ winner:'susurkaev', method:'Submission', round:3, time:'4:12' } },
      { f1:'sabatini', f2:'gomis', division:'Featherweight', odds:null,
        result:{ winner:'sabatini', method:'Decision', round:3, time:'5:00' } },
      { f1:'kopylov', f2:'mtulio', division:'Middleweight', odds:null,
        result:{ winner:'kopylov', method:'Decision', round:3, time:'5:00' } },
      { f1:'jmiller', f2:'jgordon', division:'Lightweight', odds:null,
        result:{ winner:'jmiller', method:'Submission', round:1, time:'3:29' } },
      { f1:'gdawson', f2:'rebecki', division:'Lightweight', odds:null,
        result:{ winner:'gdawson', method:'Submission', round:3, time:'4:42' } },
    ],
  },
  {
    id:'ufc-perth', name:'UFC Fight Night', subtitle:'DELLA MADDALENA vs PRATES', date:'May 2, 2026',
    venue:'RAC Arena', city:'Perth, AU', banner:'#3b1d2e',
    card:[
      { f1:'dellam', f2:'prates', division:'Welterweight · Main Event', odds:{f1:100,f2:-120},
        result:{ winner:'prates', method:'KO/TKO', round:3, time:'3:17' } },
      { f1:'dariush', f2:'salkilld', division:'Lightweight · Co-Main', odds:{f1:160,f2:-190},
        result:{ winner:'salkilld', method:'KO/TKO', round:1, time:'3:29' } },
      { f1:'pericic', f2:'gaziev', division:'Heavyweight', odds:{f1:115,f2:-135},
        result:{ winner:'pericic', method:'KO/TKO', round:2, time:'3:44' } },
      { f1:'erceg', f2:'elliott', division:'Flyweight', odds:{f1:-250,f2:200},
        result:{ winner:'erceg', method:'Decision', round:3, time:'5:00' } },
    ],
  },
  {
    id:'ufc-vegas116', name:'UFC Fight Night', subtitle:'STERLING vs ZALAL', date:'Apr 25, 2026',
    venue:'Meta APEX', city:'Las Vegas, NV', banner:'#1d2e3b',
    card:[
      { f1:'sterling', f2:'zalal', division:'Featherweight · Main Event', odds:{f1:-155,f2:130},
        result:{ winner:'sterling', method:'Decision', round:5, time:'5:00' } },
      { f1:'jedwards', f2:'dumont', division:"Women's Bantamweight · Co-Main", odds:{f1:140,f2:-165},
        result:{ winner:'jedwards', method:'Decision', round:3, time:'5:00' } },
      { f1:'spann', f2:'buchecha', division:'Heavyweight', odds:{f1:125,f2:-150},
        result:{ winner:'spann', method:'KO/TKO', round:2, time:'2:10' } },
      { f1:'rgarcia', f2:'ahernandez', division:'Lightweight', odds:{f1:115,f2:-135},
        result:{ winner:'rgarcia', method:'Decision', round:3, time:'5:00' } },
      { f1:'mcvey', f2:'dumas', division:'Middleweight', odds:{f1:-115,f2:-105},
        result:{ winner:'mcvey', method:'Submission', round:1, time:'2:14' } },
    ],
  },
  {
    id:'ufc-winnipeg', name:'UFC Fight Night', subtitle:'BURNS vs MALOTT', date:'Apr 18, 2026',
    venue:'Canada Life Centre', city:'Winnipeg, CA', banner:'#1d3b34',
    card:[
      { f1:'burns', f2:'malott', division:'Welterweight · Main Event', odds:{f1:135,f2:-160},
        result:{ winner:'malott', method:'KO/TKO', round:3, time:'2:38' } },
      { f1:'jourdain', f2:'kphillips', division:'Bantamweight · Co-Main', odds:{f1:120,f2:-140},
        result:{ winner:'jourdain', method:'Decision', round:3, time:'5:00' } },
      { f1:'saricam', f2:'boser', division:'Heavyweight', odds:{f1:-240,f2:195},
        result:{ winner:'saricam', method:'KO/TKO', round:2, time:'4:43' } },
    ],
  },
  {
    id:'ufc-327', name:'UFC 327', subtitle:'PROCHÁZKA vs ULBERG', date:'Apr 11, 2026',
    venue:'Kaseya Center', city:'Miami, FL', banner:'#1d2b3b',
    card:[
      { f1:'prochazka', f2:'ulberg', division:'Light Heavyweight · Title', odds:{f1:-150,f2:130},
        result:{ winner:'ulberg', method:'KO/TKO', round:1, time:'3:45' } },
      { f1:'pcosta', f2:'murzakanov', division:'Light Heavyweight', odds:null,
        result:{ winner:'pcosta', method:'KO/TKO', round:3, time:'1:23' } },
      { f1:'blaydes', f2:'hokit', division:'Heavyweight', odds:null,
        result:{ winner:'hokit', method:'Decision', round:3, time:'5:00' } },
      { f1:'dreyes', f2:'johnnyw', division:'Light Heavyweight', odds:null,
        result:{ winner:'dreyes', method:'Decision', round:3, time:'5:00' } },
      { f1:'cswanson', f2:'nlandwehr', division:'Featherweight', odds:null,
        result:{ winner:'cswanson', method:'KO/TKO', round:1, time:'2:58' } },
      { f1:'apico', f2:'pitbull', division:'Featherweight', odds:null,
        result:{ winner:'apico', method:'Decision', round:3, time:'5:00' } },
      { f1:'kholland', f2:'rbrown', division:'Welterweight', odds:null,
        result:{ winner:'kholland', method:'Decision', round:3, time:'5:00' } },
      { f1:'gamrot', f2:'ribovics', division:'Lightweight', odds:null,
        result:{ winner:'gamrot', method:'Submission', round:2, time:'4:19' } },
      { f1:'tsuarez', f2:'godinez', division:"Women's Strawweight", odds:null,
        result:{ winner:'tsuarez', method:'Submission', round:2, time:'2:29' } },
      { f1:'cpadilla', f2:'mederos', division:'Lightweight', odds:null,
        result:{ winner:'draw', method:'Decision', round:3, time:'5:00' } },
      { f1:'luque', f2:'gastelum', division:'Welterweight', odds:null,
        result:{ winner:'luque', method:'Submission', round:1, time:'4:08' } },
      { f1:'radtke', f2:'fprado', division:'Welterweight', odds:null,
        result:{ winner:'radtke', method:'Decision', round:3, time:'5:00' } },
    ],
  },
  {
    id:'ufc-vegas115', name:'UFC Fight Night', subtitle:'MOICANO vs DUNCAN', date:'Apr 4, 2026',
    venue:'Meta APEX', city:'Las Vegas, NV', banner:'#2b1d3b',
    card:[
      { f1:'moicano', f2:'duncan', division:'Lightweight · Main Event', odds:{f1:-175,f2:145},
        result:{ winner:'moicano', method:'Submission', round:2, time:'3:14' } },
      { f1:'jandiroba', f2:'ricci', division:"Women's Strawweight · Co-Main", odds:{f1:-200,f2:165},
        result:{ winner:'jandiroba', method:'Decision', round:3, time:'5:00' } },
      { f1:'flowers', f2:'vannata', division:'Lightweight', odds:{f1:140,f2:-165},
        result:{ winner:'flowers', method:'KO/TKO', round:2, time:'0:52' } },
    ],
  },
  {
    id:'ufc-326', name:'UFC 326', subtitle:'HOLLOWAY vs OLIVEIRA 2', date:'Mar 7, 2026',
    venue:'T-Mobile Arena', city:'Las Vegas, NV', banner:'#2e1d3b',
    card:[
      { f1:'holloway', f2:'coliveira', division:'Lightweight · BMF Title', odds:{f1:-200,f2:165},
        result:{ winner:'coliveira', method:'Decision', round:5, time:'5:00' } },
    ],
  },
  {
    id:'ufc-322', name:'UFC 322', subtitle:'MAKHACHEV vs DELLA MADDALENA', date:'Nov 22, 2025',
    venue:'Madison Square Garden', city:'New York, NY', banner:'#1d3b2e',
    card:[
      { f1:'makhachev', f2:'dellam', division:'Welterweight · Title', odds:{f1:-200,f2:165},
        result:{ winner:'makhachev', method:'Decision', round:5, time:'5:00' } },
    ],
  },
  {
    id:'ufc-rio', name:'UFC Fight Night', subtitle:'OLIVEIRA vs GAMROT', date:'Oct 11, 2025',
    venue:'Farmasi Arena', city:'Rio de Janeiro, BR', banner:'#1d3b2e',
    card:[
      { f1:'coliveira', f2:'gamrot', division:'Lightweight · Main Event', odds:{f1:-185,f2:155},
        result:{ winner:'coliveira', method:'Submission', round:2, time:'2:48' } },
    ],
  },
  {
    id:'ufc-320', name:'UFC 320', subtitle:'PEREIRA vs ANKALAEV', date:'Oct 4, 2025',
    venue:'T-Mobile Arena', city:'Las Vegas, NV', banner:'#3b2e1d',
    card:[
      { f1:'pereira', f2:'ankalaev', division:'Light Heavyweight · Title', odds:{f1:-130,f2:110},
        result:{ winner:'pereira', method:'KO/TKO', round:1, time:'1:24' } },
    ],
  },
  {
    id:'ufc-317', name:'UFC 317', subtitle:'TOPURIA vs OLIVEIRA', date:'Jun 28, 2025',
    venue:'T-Mobile Arena', city:'Las Vegas, NV', banner:'#2e1d3b',
    card:[
      { f1:'topuria', f2:'coliveira', division:'Lightweight · Title', odds:{f1:-260,f2:210},
        result:{ winner:'topuria', method:'KO/TKO', round:1, time:'2:27' } },
    ],
  },
];

// ── BACKTEST ENGINE ──────────────────────────────────────────────────
// Applies the live predictFight() heuristic to every completed fight and
// grades it against the real outcome. NOTE: the engine reads CURRENT fighter
// stats, not point-in-time pre-fight data — this is an honest illustrative
// backtest, not a true pre-registered track record.
function gradePastFight(ev, bout) {
  const a = f(bout.f1), b = f(bout.f2);
  if (!a||!b) return null;
  const pred = predictFight(a,b,scheduledRounds(bout));
  const modelPickId = pred.aProb>50 ? a.id : b.id;
  const modelPick = f(modelPickId);
  const conf = Math.max(pred.aProb,pred.bProb);
  const res = bout.result;
  const isDraw = res.winner==='draw';
  const pickCorrect = !isDraw && modelPickId===res.winner;
  const methodCorrect = !isDraw && pred.primary===res.method;
  // round window check
  const rNums = ((pred.roundWin||'').match(/\d+/g)||[]).map(Number);
  const roundCorrect = !isDraw && res.method!=='Decision' && rNums.length>0 &&
    res.round>=Math.min(...rNums) && res.round<=Math.max(...rNums);
  // odds for the model's pick (real if available, else model-implied)
  const realOdds = bout.odds ? (modelPickId===bout.f1?bout.odds.f1:bout.odds.f2) : null;
  const pickOdds = realOdds ?? probToAmerican(conf);
  const isUnderdog = realOdds!==null && realOdds>0;
  const dec = americanToDecimal(pickOdds);
  const roi = isDraw ? 0 : (pickCorrect ? +(dec-1).toFixed(2) : -1);
  // upset = real winner was the model's underdog / lower-prob side
  const winnerProb = isDraw ? 50 : (res.winner===a.id?pred.aProb:pred.bProb);
  const wasUpset = !isDraw && winnerProb<42;
  return {
    event:ev, bout, a, b, pred, modelPick, conf, res, isDraw,
    pickCorrect, methodCorrect, roundCorrect, pickOdds, isUnderdog, roi, winnerProb, wasUpset,
    winner: isDraw?null:f(res.winner),
  };
}
function runBacktest() {
  const fights = [];
  PAST_EVENTS.forEach(ev => ev.card.forEach(bout => {
    const g = gradePastFight(ev, bout);
    if (g) fights.push(g);
  }));
  return fights;
}

// ── UFC ELO ENGINE ───────────────────────────────────────────────────
// A transparent, model-derived rating. Each fighter is SEEDED from their
// career profile (record, ranking, streak, age), then the rating is
// UPDATED by the real results stored in PAST_EVENTS using a standard Elo
// exchange with finish / title / dominance multipliers. This is a model —
// the UFC publishes no official Elo — and it only covers fighters loaded
// into this database, not the full ~700-athlete live roster.
const DIVISIONS = {
  FLW:'Flyweight', BW:'Bantamweight', FW:'Featherweight', LW:'Lightweight',
  WW:'Welterweight', MW:'Middleweight', LHW:'Light Heavyweight', HW:'Heavyweight',
  WSW:"Women's Strawweight", WFLW:"Women's Flyweight", WBW:"Women's Bantamweight",
};

function seedElo(fr) {
  let e = 1450;
  const ww = fr.wins||0, ll = fr.losses||0;
  e += (ww/((ww+ll)||1) - 0.5) * 300;          // career win rate
  e += Math.min(ww,28) * 4.5;                   // experience / volume
  if (fr.rank==='C') e += 135;                  // champion
  else if (typeof fr.rank==='number') e += Math.max(0,16-fr.rank)*7;
  if (fr.p4p) e += Math.max(0,16-fr.p4p)*6;     // pound-for-pound standing
  const s = fr.streak||'', sv = parseInt(s.slice(1))||0;
  if (s.startsWith('W')) e += Math.min(sv,9)*9;
  else if (s.startsWith('L')) e -= Math.min(sv,6)*12;
  if (fr.age>=27 && fr.age<=32) e += 14;        // athletic prime
  else if (fr.age>35) e -= (fr.age-35)*7;
  else if (fr.age<24) e -= (24-fr.age)*5;
  return Math.round(e);
}

function buildElo() {
  const elo = {}, hist = {};
  Object.values(FIGHTERS).forEach(fr => {
    elo[fr.id] = seedElo(fr);
    hist[fr.id] = [{ label:'Career seed', elo:elo[fr.id], delta:0 }];
  });
  [...PAST_EVENTS].reverse().forEach(ev => {        // oldest -> newest
    ev.card.forEach(bout => {
      const a=bout.f1, b=bout.f2, res=bout.result;
      if (!FIGHTERS[a]||!FIGHTERS[b]||res.winner==='draw') return;
      const Ra=elo[a], Rb=elo[b];
      const Ea = 1/(1+Math.pow(10,(Rb-Ra)/400));
      const Sa = res.winner===a ? 1 : 0;
      const title = /Title/i.test(bout.division||'');
      const finish = res.method==='KO/TKO' || res.method==='Submission';
      const winnerExp = Sa===1 ? Ea : 1-Ea;             // winner's pre-fight expected score
      let K = title ? 42 : 30;
      let mult = 1;
      if (res.method==='KO/TKO')          mult += 0.30; // knockout reward
      else if (res.method==='Submission') mult += 0.34; // submission reward (rarer, more dominant)
      else                                mult -= 0.12; // decision — modest discount
      if (finish && res.round===1)        mult += 0.30; // early-finish bonus
      else if (finish && res.round===2)   mult += 0.14;
      if (finish && title)                mult += 0.22; // title-fight finish bonus
      if (winnerExp < 0.42)               mult += 0.14; // upset win
      if (winnerExp < 0.42 && finish)     mult += 0.22; // upset finish — major
      if (!finish && winnerExp>0.44 && winnerExp<0.58) mult -= 0.10; // narrow/competitive decision
      mult = Math.max(0.6, mult);
      const dA = Math.round(K*mult*(Sa-Ea));
      elo[a]=Ra+dA; elo[b]=Rb-dA;
      hist[a].push({ label:ev.name.replace('UFC ',''), elo:elo[a], delta:dA, method:res.method, finish, round:res.round });
      hist[b].push({ label:ev.name.replace('UFC ',''), elo:elo[b], delta:-dA, method:res.method, finish, round:res.round });
    });
  });
  return { elo, hist };
}
const ELO = buildElo();

// ── RESULT SYNC ──────────────────────────────────────────────────────
// Newly completed events whose outcomes are not yet baked into the static
// FIGHTERS records. Applied once, after Elo is built (so Elo seeding is not
// double-counted), keeping records / streaks / last-result fields current.
const NEWLY_COMPLETED = ['mvp-1','ufc-allen-costa'];
(function syncRecordsFromResults(){
  NEWLY_COMPLETED.forEach(evId => {
    const ev = PAST_EVENTS.find(e=>e.id===evId);
    if (!ev) return;
    ev.card.forEach(b => {
      const res=b.result; if (res.winner==='draw') return;
      const wId=res.winner, lId = wId===b.f1?b.f2:b.f1;
      const w=FIGHTERS[wId], l=FIGHTERS[lId];
      const oppName = id => (FIGHTERS[id]?.name||'').split(' ').slice(-1)[0];
      if (w) {
        const d = (w.record.split('-')[2])||'0';
        w.wins += 1; w.record = `${w.wins}-${w.losses}-${d}`;
        w.streak = w.streak && w.streak.startsWith('W') ? `W${(parseInt(w.streak.slice(1))||0)+1}` : 'W1';
        const m = res.method==='Decision' ? `DEC` : res.method==='Submission' ? `SUB${res.round}` : `KO${res.round}`;
        w.last = `W ${m} vs ${oppName(lId)}`;
      }
      if (l) {
        const d = (l.record.split('-')[2])||'0';
        l.losses += 1; l.record = `${l.wins}-${l.losses}-${d}`;
        l.streak = l.streak && l.streak.startsWith('L') ? `L${(parseInt(l.streak.slice(1))||0)+1}` : 'L1';
        const m = res.method==='Decision' ? `DEC` : res.method==='Submission' ? `SUB${res.round}` : `KO${res.round}`;
        l.last = `L ${m} vs ${oppName(wId)}`;
      }
    });
  });
})();
function eloOf(id){ return ELO.elo[id] ?? 1500; }
function eloHistOf(id){ return ELO.hist[id] || [{ label:'Career seed', elo:1500, delta:0 }]; }
function eloDeltaOf(id){ const h=eloHistOf(id); return h.length>1 ? h[h.length-1].elo-h[0].elo : 0; }
function eloPeakOf(id){ return Math.max(...eloHistOf(id).map(p=>p.elo)); }
const ELO_BOARD = Object.values(FIGHTERS).slice().sort((x,y)=>eloOf(y.id)-eloOf(x.id));
const ELO_RANK = {}; ELO_BOARD.forEach((fr,i)=>{ ELO_RANK[fr.id]=i+1; });
function eloRankOverall(id){ return ELO_RANK[id]||0; }
const ELO_DIV = {};
Object.keys(DIVISIONS).forEach(d=>{
  ELO_DIV[d] = Object.values(FIGHTERS).filter(fr=>fr.division===d).sort((x,y)=>eloOf(y.id)-eloOf(x.id));
});
function eloRankInDivision(id){
  const fr=FIGHTERS[id]; if(!fr||!ELO_DIV[fr.division]) return 0;
  return ELO_DIV[fr.division].findIndex(x=>x.id===id)+1;
}
// projected Elo swing for a hypothetical upcoming bout
function projectElo(aId,bId){
  const Ra=eloOf(aId), Rb=eloOf(bId), K=32;
  const Ea=1/(1+Math.pow(10,(Rb-Ra)/400));
  return {
    Ea:Math.round(Ea*100), Eb:Math.round((1-Ea)*100),
    aWin:Math.round(K*(1-Ea)), aLoss:Math.round(K*(0-Ea)),
    bWin:Math.round(K*Ea),     bLoss:Math.round(K*(0-(1-Ea))),
  };
}

// ═══════════════════════════════════════════════════════════════════════
// TRANSPARENT PREDICTION ENGINE — published formula, not a trained model
// ═══════════════════════════════════════════════════════════════════════

const W = { STRIKE:0.85, GRAPPLE:0.65, REACH:0.04, AGE_AFTER:32, AGE_RATE:0.035, RECORD:0.7, CHAMP:0.18, K:0.85 };

// finishProfile — derives KO and submission finishing threat from a fighter's
// stats, declared style, and most-recent result. Drives realistic finish odds.
function finishProfile(ft) {
  const s = (ft.style||'').toLowerCase();
  const last = (ft.last||'').toLowerCase();
  // striking finish threat: output × power/style signals
  let ko = (ft.slpm||2.5) * ((ft.strAcc||45)/100);
  if (/ko|knockout|power|brawler|sniper|dynamite|finish|devastating/.test(s)) ko *= 1.6;
  else if (/strik|kickbox|boxer|volume/.test(s)) ko *= 1.2;
  if (/ko\d|tko|ko vs/.test(last)) ko *= 1.25;
  // submission finish threat: sub attempts + grappling control
  let sub = (ft.subAvg||0)*1.15 + (ft.tdAvg||0)*((ft.tdAcc||40)/100)*0.35;
  if (/submission|grappl|jiu|bjj|choke/.test(s)) sub *= 1.7;
  else if (/wrestl|control/.test(s)) sub *= 1.15;
  if (/sub\d|sub vs/.test(last)) sub *= 1.3;
  // pace / aggression scales overall finish likelihood
  const aggr = /pressure|aggressive|brawl|explosive|forward|relentless|finish/.test(s) ? 1.18
             : /counter|technical|point|veteran|defensive|rangy/.test(s) ? 0.9 : 1.0;
  return { ko:+ko.toFixed(3), sub:+sub.toFixed(3), aggr };
}

// scheduledRounds — UFC rules: championship fights and Fight Night main
// events are 5 rounds; every other bout (co-mains, main card, prelims) is 3.
function scheduledRounds(bout) {
  if (bout && bout.rounds) return bout.rounds;
  const tag = ((bout&&bout.division)||'') + ' ' + ((bout&&bout.slot)||'');
  return /title|main event/i.test(tag) ? 5 : 3;
}

function predictFight(a, b, rounds=3) {
  const aStrike = a.slpm && a.strAcc ? a.slpm*(a.strAcc/100) : 2.2;
  const bStrike = b.slpm && b.strAcc ? b.slpm*(b.strAcc/100) : 2.2;
  const aGrap = ((a.tdAvg??0)*((a.tdAcc??0)/100))+((a.subAvg??0)*0.3);
  const bGrap = ((b.tdAvg??0)*((b.tdAcc??0)/100))+((b.subAvg??0)*0.3);
  const reachDiff = (a.reach??0)-(b.reach??0);
  const aAge = Math.max(0,(a.age-W.AGE_AFTER))*W.AGE_RATE;
  const bAge = Math.max(0,(b.age-W.AGE_AFTER))*W.AGE_RATE;
  const aPct = a.wins/Math.max(1,a.wins+a.losses);
  const bPct = b.wins/Math.max(1,b.wins+b.losses);
  const aChamp = a.rank==='C'?W.CHAMP:0;
  const bChamp = b.rank==='C'?W.CHAMP:0;

  const aR = aStrike*W.STRIKE + aGrap*W.GRAPPLE + reachDiff*W.REACH + aPct*W.RECORD + aChamp - aAge;
  const bR = bStrike*W.STRIKE + bGrap*W.GRAPPLE + (-reachDiff)*W.REACH + bPct*W.RECORD + bChamp - bAge;
  const diff = aR-bR;
  const aProb = 1/(1+Math.exp(-diff*W.K));

  // ── FINISH MODELLING — realistic KO / submission / decision split ──
  const fa = finishProfile(a), fb = finishProfile(b);
  const edge = Math.abs(aProb-0.5);                  // lopsided fights finish more often
  const domBoost  = 1 + edge*0.9;                    // up to ~1.45×
  const paceBoost = (fa.aggr + fb.aggr)/2;           // ~0.9–1.18×
  const koScore  = fa.ko*fa.aggr + fb.ko*fb.aggr;
  const subScore = fa.sub + fb.sub;
  let ko  = Math.min(0.80, koScore  * 0.055 * domBoost);
  let sub = Math.min(0.50, subScore * 0.083 * domBoost * paceBoost);
  if (ko+sub > 0.92) { const sc=0.92/(ko+sub); ko*=sc; sub*=sc; }
  let dec = Math.max(0.08, 1-ko-sub);
  let methods = [
    {name:'Decision', value:dec, color:'#a3a3a3'},
    {name:'KO/TKO', value:ko, color:'#dc2626'},
    {name:'Submission', value:sub, color:'#0ea5e9'},
  ];
  const t = methods.reduce((s,m)=>s+m.value,0);
  methods.forEach(m=>m.value=Math.round((m.value/t)*100));
  methods[0].value += 100-methods.reduce((s,m)=>s+m.value,0);
  const primary = methods.reduce((x,y)=>x.value>y.value?x:y);

  // round logic — decisions carry NO round; finishes never exceed fight length
  let finishRound=null, roundWin=null;
  if (primary.name==='KO/TKO') {
    finishRound = ko>0.46?1:ko>0.30?2:3;
    roundWin = finishRound===1?'R1':finishRound===2?'R1–R2':'R2–R3';
  } else if (primary.name==='Submission') {
    finishRound = sub>0.34?2:3;
    roundWin = sub>0.34?'R1–R2':'R2–R3';
  }
  if (finishRound!=null && finishRound>rounds) finishRound = rounds;

  const conf = Math.abs(aProb-0.5);
  let cLabel='Low';
  if (conf>0.15) cLabel='Medium';
  if (conf>0.27) cLabel='High';
  if (conf>0.38) cLabel='Elite';
  const risk = Math.round((1-conf*2)*10*10)/10;

  const finishPct = ko+sub;
  const koLean = ko/Math.max(0.01,ko+sub);
  // 5-round fights carry meaningful late-round finish weight; 3-round fights front-load
  const curve5 = koLean>0.55 ? [0.30,0.26,0.20,0.14,0.10]
               : koLean<0.40 ? [0.16,0.24,0.24,0.20,0.16]
               :               [0.24,0.25,0.22,0.16,0.13];
  const curve3 = koLean>0.55 ? [0.42,0.34,0.24]
               : koLean<0.40 ? [0.28,0.38,0.34]
               :               [0.38,0.34,0.28];
  const curve = rounds>=5 ? curve5 : curve3;
  const rbr = curve.map((w,i)=>({ round:`R${i+1}`, finish:Math.round(finishPct*w*100) }));

  return {
    aProb:+(aProb*100).toFixed(1), bProb:+((1-aProb)*100).toFixed(1),
    ratingDiff:+diff.toFixed(2), aRating:+aR.toFixed(2), bRating:+bR.toFixed(2),
    methods, primary:primary.name, primaryProb:primary.value, roundWin,
    confidence:cLabel, confScore:Math.round(Math.max(aProb,1-aProb)*100), risk,
    finishPct:Math.round(finishPct*100), rbr, finishRound, rounds,
    comp:{ aStrike:+aStrike.toFixed(2), bStrike:+bStrike.toFixed(2),
      aGrap:+aGrap.toFixed(2), bGrap:+bGrap.toFixed(2), reachDiff,
      aPct:+(aPct*100).toFixed(1), bPct:+(bPct*100).toFixed(1),
      aAge:+aAge.toFixed(2), bAge:+bAge.toFixed(2) },
  };
}

function probToAmerican(prob) {
  const p = prob/100;
  if (p<=0.01) return 9900;
  if (p>=0.99) return -9900;
  if (p>=0.5) return -Math.round((p/(1-p))*100);
  return Math.round(((1-p)/p)*100);
}
function impliedProb(am) { return am>0 ? (100/(am+100))*100 : (-am/(-am+100))*100; }
function americanToDecimal(am) { return am>0 ? (am/100)+1 : (100/-am)+1; }
const fmtOdds = (n)=> n>0?`+${n}`:`${n}`;

function generateMarkets(a, b, pred, realOdds) {
  const ml = realOdds || { f1:probToAmerican(pred.aProb), f2:probToAmerican(pred.bProb) };
  const ko = pred.methods.find(m=>m.name==='KO/TKO').value;
  const sub = pred.methods.find(m=>m.name==='Submission').value;
  const dec = pred.methods.find(m=>m.name==='Decision').value;
  const finishPct = ko+sub;
  return {
    moneyline: ml, isRealOdds: !!realOdds,
    method: [
      { label:'Wins by KO/TKO', prob:ko, odds:probToAmerican(Math.max(3,ko)) },
      { label:'Wins by Submission', prob:sub, odds:probToAmerican(Math.max(3,sub)) },
      { label:'Wins by Decision', prob:dec, odds:probToAmerican(Math.max(3,dec)) },
    ],
    finish: [
      { label:'Ends inside distance', prob:finishPct, odds:probToAmerican(Math.max(5,finishPct)) },
      { label:'Goes to decision', prob:100-finishPct, odds:probToAmerican(Math.max(5,100-finishPct)) },
    ],
    total: (()=>{
      const line = (pred.rounds>=5) ? 4.5 : 2.5;
      const underProb = Math.min(85, finishPct+10);
      return { line,
        under:{ prob:underProb, odds:probToAmerican(Math.max(5,underProb)) },
        over:{ prob:100-underProb, odds:probToAmerican(Math.max(5,100-underProb)) } };
    })(),
  };
}

function buildExplanation(a, b, pred) {
  const win = pred.aProb>50?a:b, lose = pred.aProb>50?b:a;
  const wS = pred.aProb>50?pred.comp.aStrike:pred.comp.bStrike;
  const lS = pred.aProb>50?pred.comp.bStrike:pred.comp.aStrike;
  const wG = pred.aProb>50?pred.comp.aGrap:pred.comp.bGrap;
  const lG = pred.aProb>50?pred.comp.bGrap:pred.comp.aGrap;
  const p = [];
  p.push(`The model favors ${win.name} at ${Math.max(pred.aProb,pred.bProb).toFixed(1)}%.`);
  if (wS>lS+0.3) p.push(`Striking-output edge (${wS} vs ${lS}, SLpM × accuracy) is the largest single factor.`);
  else if (lS>wS+0.3) p.push(`${lose.name} actually owns the striking-output edge — this pick leans on grappling and record.`);
  else p.push(`Striking outputs are near-even (${wS} vs ${lS}).`);
  if (wG>lG+0.2) p.push(`Grappling threat differential (${wG} vs ${lG}) tilts further toward ${win.name}.`);
  if (Math.abs(win.reach-lose.reach)>=3) p.push(`${win.reach>lose.reach?win.name+' carries a ':lose.name+' actually has the '}${Math.abs(win.reach-lose.reach)}" reach edge.`);
  if (win.age<=32 && lose.age>34) p.push(`Age curve clearly favors ${win.name} (${win.age}) over ${lose.name} (${lose.age}).`);
  if (win.rank==='C') p.push(`Champion-intangibles weight applied.`);
  p.push(`Projected path: ${pred.primary}${pred.roundWin?' '+pred.roundWin:' (to the scorecards)'} (${pred.primaryProb}%). Risk ${pred.risk}/10.`);
  return p.join(' ');
}

function getAllFights() {
  const out = [];
  EVENTS.forEach(ev => {
    const all = [
      ...ev.card.map(b=>({bout:b,section:'main'})),
      ...((ev.prelimCard||[]).map(b=>({bout:b,section:'prelim'}))),
    ];
    all.forEach(({bout,section},idx) => {
      const a = f(bout.f1), b = f(bout.f2);
      if (!a||!b) return;
      const pred = predictFight(a,b,scheduledRounds(bout));
      const winner = pred.aProb>50?a:b;
      const wProb = Math.max(pred.aProb,pred.bProb);
      const realOdds = bout.odds ? (pred.aProb>50?bout.odds.f1:bout.odds.f2) : null;
      const markets = generateMarkets(a,b,pred,bout.odds);
      const winnerOdds = realOdds ?? probToAmerican(wProb);
      const impl = impliedProb(winnerOdds);
      const edge = wProb - impl;
      out.push({ event:ev, bout, idx, section, a, b, pred, winner, wProb, winnerOdds, impl, edge, markets,
        isUnderdog: realOdds!==null && realOdds>0 });
    });
  });
  return out;
}

// ═══════════════════════════════════════════════════════════════════════
// UI PRIMITIVES
// ═══════════════════════════════════════════════════════════════════════

const Pill = ({ children, tone='neutral', icon:Icon }) => {
  const t = {
    neutral:'bg-zinc-800/60 text-zinc-300 border-zinc-700/60',
    red:'bg-red-950/60 text-red-300 border-red-900/70',
    green:'bg-emerald-950/60 text-emerald-300 border-emerald-900/70',
    amber:'bg-amber-950/60 text-amber-300 border-amber-900/70',
    blue:'bg-sky-950/60 text-sky-300 border-sky-900/70',
    purple:'bg-purple-950/60 text-purple-300 border-purple-900/70',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.13em] px-2 py-1 border rounded-sm font-medium whitespace-nowrap ${t[tone]}`}>
      {Icon && <Icon size={11} />}{children}
    </span>
  );
};

const ConfidenceRing = ({ value, size=120, label, sublabel, color='#dc2626' }) => {
  const r=(size-16)/2, c=2*Math.PI*r, dash=(value/100)*c;
  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{width:size,height:size}}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="#27272a" strokeWidth="6" fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth="6" fill="none"
          strokeDasharray={`${dash} ${c}`} strokeLinecap="butt"/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-mono text-2xl text-zinc-100 tabular-nums font-bold leading-none">{value.toFixed(1)}%</div>
        {label && <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 mt-1">{label}</div>}
        {sublabel && <div className="text-[10px] text-zinc-400 mt-0.5 text-center px-1">{sublabel}</div>}
      </div>
    </div>
  );
};

// ─── MEDIA LAYER ───────────────────────────────────────────────────────
// MediaImage: lazy-loaded image with skeleton + graceful fallback.
// Architected so real licensed photo URLs (fighter.photo / event.art) drop
// straight in. With no licensed src present it renders the fallback artwork.
const MediaImage = ({ src, alt='', className='', fallback=null, imgClass='' }) => {
  const [status, setStatus] = useState(src ? 'idle' : 'fallback');
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(()=>{
    if (!src) { setStatus('fallback'); return; }
    setStatus('idle');
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e])=>{
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { rootMargin:'120px' });
    obs.observe(el);
    return ()=>obs.disconnect();
  },[src]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {status!=='loaded' && (
        status==='fallback'
          ? fallback
          : <div className="absolute inset-0 bg-zinc-900 animate-pulse"/>
      )}
      {src && visible && status!=='fallback' && (
        <img src={src} alt={alt} loading="lazy" decoding="async"
          onLoad={()=>setStatus('loaded')} onError={()=>setStatus('fallback')}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            status==='loaded'?'opacity-100':'opacity-0'} ${imgClass}`}/>
      )}
    </div>
  );
};

// FighterPortrait: original rim-lit SVG illustration — no copyrighted media.
const HEAD_PATH = "M100 24 C124 24 142 45 142 71 C142 95 126 112 100 112 C74 112 58 95 58 71 C58 45 76 24 100 24 Z";
const BODY_PATH = "M80 104 L120 104 L120 122 C162 129 190 158 198 230 L2 230 C10 158 38 129 80 122 Z";

const FighterPortrait = ({ fighter, detail=false }) => {
  const id = fighter.id;
  const hash = id.split('').reduce((s,c)=>s+c.charCodeAt(0),0);
  const tilt = ((hash%9)-4); // -4..4 deg head tilt for variety
  return (
    <svg viewBox="0 0 200 230" className="w-full h-full block" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`glow-${id}`} cx="50%" cy="34%" r="68%">
          <stop offset="0%" stopColor={fighter.color} stopOpacity="0.95"/>
          <stop offset="48%" stopColor={fighter.color} stopOpacity="0.32"/>
          <stop offset="100%" stopColor="#08080a" stopOpacity="1"/>
        </radialGradient>
        <linearGradient id={`sil-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#26262e"/>
          <stop offset="100%" stopColor="#08080a"/>
        </linearGradient>
        <pattern id={`dots-${id}`} width="13" height="13" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.5" fill={fighter.color}/>
        </pattern>
        <filter id={`blur-${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={detail?5:3.5}/>
        </filter>
      </defs>
      <rect width="200" height="230" fill="#08080a"/>
      <rect width="200" height="230" fill={`url(#glow-${id})`}/>
      <rect width="200" height="230" fill={`url(#dots-${id})`} opacity="0.11"/>
      <g transform={`rotate(${tilt} 100 78)`}>
        {/* rim glow */}
        <g filter={`url(#blur-${id})`} opacity="0.9">
          <path d={BODY_PATH} fill="none" stroke={fighter.color} strokeWidth="3.5"/>
          <path d={HEAD_PATH} fill="none" stroke={fighter.color} strokeWidth="3.5"/>
        </g>
        {/* silhouette */}
        <path d={BODY_PATH} fill={`url(#sil-${id})`}/>
        <path d={HEAD_PATH} fill={`url(#sil-${id})`}/>
        {/* rim light edge */}
        <path d={HEAD_PATH} fill="none" stroke={fighter.color} strokeWidth="2.4" strokeOpacity="0.85"/>
        <path d={BODY_PATH} fill="none" stroke={fighter.color} strokeWidth="2" strokeOpacity="0.5"/>
        {/* collar accent */}
        <path d="M80 104 L120 104 L120 122 L80 122 Z" fill={fighter.color} opacity="0.22"/>
      </g>
      {/* accent slash */}
      <path d="M0 214 L200 196 L200 230 L0 230 Z" fill={fighter.color} opacity="0.16"/>
    </svg>
  );
};

// Avatar: clipped portrait frame. Uses MediaImage so a real photo can drop in.
const Avatar = ({ fighter, size=64, mirror=false }) => {
  const initials = fighter.name.split(' ').map(n=>n[0]).join('').slice(0,2);
  const big = size>=72;
  return (
    <div className="relative shrink-0"
      style={{ width:size, height:size,
        clipPath:'polygon(0 0,100% 0,100% 85%,85% 100%,0 100%)',
        transform: mirror?'scaleX(-1)':'none' }}>
      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.08]">
        <MediaImage
          src={fighter.photo}
          alt={fighter.name}
          className="w-full h-full"
          fallback={<FighterPortrait fighter={fighter} detail={big}/>}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
        style={{ background:'linear-gradient(to top, rgba(8,8,10,0.9), transparent)' }}/>
      <div className="absolute bottom-0.5 right-1 text-[9px] leading-none"
        style={{ transform:mirror?'scaleX(-1)':'none' }}>{fighter.country}</div>
      {big && (
        <div className="absolute bottom-0.5 left-1.5 font-display text-white/85 tracking-tight leading-none"
          style={{ fontSize:size*0.13, transform:mirror?'scaleX(-1)':'none' }}>{initials}</div>
      )}
    </div>
  );
};

const Countdown = ({ iso }) => {
  const [now, setNow] = useState(Date.now());
  useEffect(()=>{ const t=setInterval(()=>setNow(Date.now()),1000); return ()=>clearInterval(t); },[]);
  const target = new Date(iso).getTime();
  let d = Math.max(0, target-now);
  const days = Math.floor(d/86400000); d-=days*86400000;
  const hrs = Math.floor(d/3600000); d-=hrs*3600000;
  const mins = Math.floor(d/60000); d-=mins*60000;
  const secs = Math.floor(d/1000);
  const Unit = ({v,l}) => (
    <div className="flex flex-col items-center">
      <span className="font-mono text-lg text-zinc-100 tabular-nums font-bold leading-none">{String(v).padStart(2,'0')}</span>
      <span className="text-[8px] uppercase tracking-[0.14em] text-zinc-500 mt-1">{l}</span>
    </div>
  );
  if (target-now<=0) return <Pill tone="red">In progress / complete</Pill>;
  return (
    <div className="flex items-center gap-2">
      <Unit v={days} l="days"/><span className="text-zinc-700">:</span>
      <Unit v={hrs} l="hrs"/><span className="text-zinc-700">:</span>
      <Unit v={mins} l="min"/><span className="text-zinc-700">:</span>
      <Unit v={secs} l="sec"/>
    </div>
  );
};

const TierBadge = ({ conf }) => {
  const map = { Elite:'purple', High:'green', Medium:'amber', Low:'red' };
  return <Pill tone={map[conf]}>{conf} confidence</Pill>;
};

const Skeleton = ({ className='' }) => <div className={`bg-zinc-900 animate-pulse rounded-sm ${className}`}/>;

const StatBar = ({ left, right, leftColor='#dc2626', rightColor='#0ea5e9' }) => {
  const total = left+right || 1;
  return (
    <div className="flex h-1.5 bg-zinc-900 overflow-hidden rounded-sm">
      <div className="h-full transition-all duration-500" style={{ width:`${(left/total)*100}%`, background:leftColor }}/>
      <div className="h-full transition-all duration-500" style={{ width:`${(right/total)*100}%`, background:rightColor }}/>
    </div>
  );
};

const PageHead = ({ icon:Icon, tag, title, desc }) => (
  <div className="mb-6">
    {tag && <Pill icon={Icon}>{tag}</Pill>}
    <h1 className="font-display text-3xl sm:text-4xl text-zinc-100 tracking-tight mt-2">{title}</h1>
    {desc && <p className="text-sm text-zinc-500 mt-1 max-w-2xl">{desc}</p>}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// NAV
// ═══════════════════════════════════════════════════════════════════════

const NAV_ITEMS = [
  { id:'home', label:'Home' }, { id:'events', label:'Events' },
  { id:'betting', label:'Betting' }, { id:'lab', label:'Matchup Lab' },
  { id:'rankings', label:'Elo Rankings' }, { id:'performance', label:'Performance' },
  { id:'fighters', label:'Fighters' },
  { id:'methodology', label:'Model' },
];

const Nav = ({ view, setView }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-900/80 bg-[#0a0a0c]/90 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-4 sm:gap-6">
        <button onClick={()=>{setView('home');setMobileOpen(false);}} className="flex items-center gap-2 group shrink-0">
          <div className="relative w-7 h-7">
            <div className="absolute inset-0 bg-red-600 rotate-45"/>
            <div className="absolute inset-[3px] bg-[#0a0a0c] rotate-45"/>
            <div className="absolute inset-[6px] bg-red-600 rotate-45"/>
          </div>
          <span className="font-display text-lg sm:text-xl tracking-[0.13em] text-zinc-100 group-hover:text-white">
            OCTAGON<span className="text-red-500">.AI</span>
          </span>
        </button>
        <nav className="hidden xl:flex items-center gap-0.5">
          {NAV_ITEMS.map(item=>(
            <button key={item.id} onClick={()=>setView(item.id)}
              className={`px-2.5 py-1.5 text-[11px] uppercase tracking-[0.13em] font-medium transition-colors ${
                view===item.id?'text-white':'text-zinc-500 hover:text-zinc-300'}`}>
              {item.label}
              {view===item.id && <div className="h-[2px] bg-red-500 mt-1.5 -mb-[15px]"/>}
            </button>
          ))}
        </nav>
        <div className="flex-1"/>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-900/70 border border-zinc-800 rounded-sm w-44 lg:w-52">
          <Search size={13} className="text-zinc-500 shrink-0"/>
          <input placeholder="Search…" className="bg-transparent outline-none text-[12px] text-zinc-200 placeholder-zinc-600 w-full"/>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 border border-red-900/50 bg-red-950/30 rounded-sm">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"/>
          <span className="text-[10px] uppercase tracking-[0.12em] text-red-400 font-medium">Heuristic v1.0</span>
        </div>
        <button onClick={()=>setMobileOpen(!mobileOpen)} className="xl:hidden text-zinc-400 hover:text-white">
          {mobileOpen ? <X size={20}/> : <Layers size={20}/>}
        </button>
      </div>
      {mobileOpen && (
        <div className="xl:hidden border-t border-zinc-900 bg-[#0a0a0c] px-4 py-2 grid grid-cols-3 gap-1">
          {NAV_ITEMS.map(item=>(
            <button key={item.id} onClick={()=>{setView(item.id);setMobileOpen(false);}}
              className={`px-2 py-2 text-[11px] uppercase tracking-[0.1em] font-medium text-left ${
                view===item.id?'text-white bg-zinc-900':'text-zinc-500'}`}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

const TransparencyBanner = ({ setView }) => (
  <div className="bg-amber-950/30 border-b border-amber-900/40">
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2 flex items-center gap-3 text-[11px]">
      <AlertCircle size={13} className="text-amber-400 shrink-0"/>
      <span className="text-amber-200 leading-tight">
        <strong className="text-amber-100">Honest mode:</strong> Real UFC/MVP data (May 15, 2026). Predictions &amp; most odds use a published heuristic — not a trained ML model or live odds feed.
      </span>
      <button onClick={()=>setView('methodology')}
        className="ml-auto text-amber-300 hover:text-amber-100 uppercase tracking-[0.13em] font-medium flex items-center gap-1 shrink-0">
        How <ArrowRight size={11}/>
      </button>
    </div>
  </div>
);

// ─── page components follow ───
// ═══════════════════════════════════════════════════════════════════════
// SHARED — fight row card (clickable, used on event pages)
// ═══════════════════════════════════════════════════════════════════════

const FightRow = ({ event, bout, onClick, featured=false }) => {
  const a = f(bout.f1), b = f(bout.f2);
  if (!a||!b) return null;
  const pred = predictFight(a,b,scheduledRounds(bout));
  const winner = pred.aProb>50?a:b;
  const wProb = Math.max(pred.aProb,pred.bProb);
  const realOdds = bout.odds ? (pred.aProb>50?bout.odds.f1:bout.odds.f2) : probToAmerican(wProb);
  const impl = impliedProb(realOdds);
  const edge = wProb-impl;
  const valueRating = Math.min(5, Math.max(1, Math.round(edge/3+3)));
  return (
    <button onClick={onClick}
      className={`group w-full text-left bg-[#0e0e12] border transition-colors overflow-hidden ${
        featured?'border-red-900/50 hover:border-red-700':'border-zinc-900 hover:border-zinc-600'}`}>
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-zinc-900">
        <Pill tone={bout.titleFight?'amber':featured?'red':'neutral'} icon={bout.titleFight?Trophy:undefined}>
          {bout.slot} · {bout.division}
        </Pill>
        <span className="font-mono text-[10px] text-zinc-500">{bout.rounds} ROUNDS</span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-2 sm:gap-3 justify-end min-w-0">
            <div className="text-right min-w-0">
              <div className="font-display text-sm sm:text-lg text-zinc-100 tracking-tight truncate">{a.name.toUpperCase()}</div>
              <div className="font-mono text-[10px] text-zinc-500">{a.country} {a.record}{a.rank?` · ${a.rank==='C'?'CHAMP':'#'+a.rank}`:''}</div>
            </div>
            <Avatar fighter={a} size={featured?60:48}/>
          </div>
          <div className="font-display text-zinc-600 text-base sm:text-lg shrink-0">VS</div>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Avatar fighter={b} size={featured?60:48} mirror/>
            <div className="min-w-0">
              <div className="font-display text-sm sm:text-lg text-zinc-100 tracking-tight truncate">{b.name.toUpperCase()}</div>
              <div className="font-mono text-[10px] text-zinc-500">{b.country} {b.record}{b.rank?` · ${b.rank==='C'?'CHAMP':'#'+b.rank}`:''}</div>
            </div>
          </div>
        </div>
        <div className="mt-3 flex h-1.5 bg-zinc-900 overflow-hidden rounded-sm">
          <div className="h-full bg-red-600" style={{width:`${pred.aProb}%`}}/>
          <div className="h-full bg-amber-500" style={{width:`${pred.bProb}%`}}/>
        </div>
        <div className="flex justify-between mt-1 text-[10px] font-mono text-zinc-500">
          <span>{pred.aProb}%</span><span>{pred.bProb}%</span>
        </div>
        <div className="mt-3 pt-3 border-t border-zinc-900 grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 text-[11px]">
          <div><span className="text-zinc-600 text-[9px] uppercase tracking-[0.1em] block">AI Pick</span><span className="text-zinc-200 font-medium">{winner.name.split(' ').slice(-1)[0]}</span></div>
          <div><span className="text-zinc-600 text-[9px] uppercase tracking-[0.1em] block">Confidence</span><span className="text-red-400 font-mono font-bold">{wProb.toFixed(1)}%</span></div>
          <div><span className="text-zinc-600 text-[9px] uppercase tracking-[0.1em] block">Method</span><span className="text-zinc-200 font-mono">{pred.primary}</span></div>
          <div><span className="text-zinc-600 text-[9px] uppercase tracking-[0.1em] block">{bout.odds?'Odds':'Proj. Odds'}</span><span className="text-amber-400 font-mono">{fmtOdds(realOdds)}</span></div>
          <div><span className="text-zinc-600 text-[9px] uppercase tracking-[0.1em] block">Value</span>
            <span className="text-emerald-400">{'★'.repeat(valueRating)}{'☆'.repeat(5-valueRating)}</span>
          </div>
        </div>
      </div>
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════════════════════════════════

const Home = ({ setView, openFight, openEvent, openFighter }) => {
  const allFights = useMemo(()=>getAllFights(),[]);
  const top10 = useMemo(()=>[...allFights].sort((a,b)=>b.wProb-a.wProb).slice(0,10),[allFights]);
  const eloMovers = useMemo(()=>{
    const moved = ELO_BOARD.filter(fp=>eloDeltaOf(fp.id)!==0);
    return {
      risers: [...moved].sort((a,b)=>eloDeltaOf(b.id)-eloDeltaOf(a.id)).slice(0,4),
      drops:  [...moved].sort((a,b)=>eloDeltaOf(a.id)-eloDeltaOf(b.id)).slice(0,4),
    };
  },[]);
  const lock = top10[0];
  const nextEvent = EVENTS[0];
  const heroA = f(nextEvent.card[0].f1), heroB = f(nextEvent.card[0].f2);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* CLEAN HERO — solid dark, readable */}
      <section className="relative overflow-hidden border border-zinc-800/80 mb-6 bg-[#0c0c10]">
        <div className="absolute inset-0" style={{
          background:`radial-gradient(110% 80% at 85% 0%, ${nextEvent.banner}, transparent 60%)`, opacity:0.6 }}/>
        <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background:nextEvent.banner }}/>
        <div className="relative p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Pill tone="red" icon={Flame}>Next Event</Pill>
            <Pill icon={Calendar}>{nextEvent.date}</Pill>
            <Pill icon={MapPin}>{nextEvent.venue}, {nextEvent.city}</Pill>
            {nextEvent.historic && <Pill tone="amber" icon={Star}>Historic</Pill>}
          </div>
          <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-end">
            <div>
              <h1 className="font-display text-4xl sm:text-6xl text-zinc-100 tracking-tight leading-[0.95]">
                {nextEvent.subtitle}
              </h1>
              <div className="font-display text-sm sm:text-base text-red-400 tracking-[0.12em] mt-2">{nextEvent.name} · {nextEvent.broadcast}</div>
              <div className="flex items-center gap-4 mt-5">
                <div className="flex items-center gap-3">
                  <Avatar fighter={heroA} size={64}/>
                  <div>
                    <div className="font-display text-base text-zinc-100 leading-none">{heroA.name.toUpperCase()}</div>
                    <div className="font-mono text-[11px] text-zinc-500 mt-0.5">{heroA.record}</div>
                  </div>
                </div>
                <span className="font-display text-2xl text-zinc-700">VS</span>
                <div className="flex items-center gap-3">
                  <Avatar fighter={heroB} size={64} mirror/>
                  <div>
                    <div className="font-display text-base text-zinc-100 leading-none">{heroB.name.toUpperCase()}</div>
                    <div className="font-mono text-[11px] text-zinc-500 mt-0.5">{heroB.record}</div>
                  </div>
                </div>
              </div>
              <button onClick={()=>openEvent(nextEvent)}
                className="mt-5 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-[11px] uppercase tracking-[0.16em] font-semibold transition-colors flex items-center gap-2">
                View full card <ArrowRight size={13}/>
              </button>
            </div>
            <div className="bg-[#08080a]/80 border border-zinc-800 px-5 py-4 rounded-sm">
              <div className="text-[9px] uppercase tracking-[0.16em] text-zinc-500 mb-2">Event Countdown</div>
              <Countdown iso={nextEvent.dateISO}/>
            </div>
          </div>
        </div>
      </section>

      {/* KPI STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-zinc-900 border border-zinc-900 mb-6 rounded-sm overflow-hidden">
        {[
          {l:'Events Tracked',v:EVENTS.length,s:'May–Jun 2026',c:'text-zinc-100'},
          {l:'Fights Analyzed',v:allFights.length,s:'Main + prelim',c:'text-zinc-100'},
          {l:'Fighters in DB',v:Object.keys(FIGHTERS).length,s:'Real records',c:'text-zinc-100'},
          {l:'Lock of the Night',v:`${lock.wProb.toFixed(0)}%`,s:lock.winner.name.split(' ').slice(-1)[0],c:'text-red-400'},
          {l:'Title Fights',v:'3',s:'On Freedom 250',c:'text-amber-400'},
          {l:'Avg Confidence',v:`${(allFights.reduce((s,x)=>s+x.wProb,0)/allFights.length).toFixed(0)}%`,s:'All cards',c:'text-sky-400'},
        ].map((k,i)=>(
          <div key={i} className="bg-[#0e0e12] px-4 py-3.5 hover:bg-[#131318] transition-colors">
            <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{k.l}</div>
            <div className={`mt-1.5 font-mono text-xl sm:text-2xl ${k.c} tabular-nums font-bold leading-none`}>{k.v}</div>
            <div className="text-[10px] text-zinc-500 mt-1 truncate">{k.s}</div>
          </div>
        ))}
      </div>

          <section className="relative overflow-hidden border border-red-900/50 bg-gradient-to-br from-red-950/30 via-[#0e0e12] to-[#0a0a0c]">
            <div className="relative p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lock size={15} className="text-red-500"/>
                  <h3 className="font-display text-lg tracking-[0.08em] text-zinc-100">LOCK OF THE NIGHT</h3>
                </div>
                <Pill tone="red">Highest-rated pick</Pill>
              </div>
              <button onClick={()=>openFight(lock.event, lock.bout)}
                className="group w-full text-left grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-6">
                <Avatar fighter={lock.winner} size={84}/>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{lock.event.subtitle} · {lock.bout.division}</div>
                  <h4 className="font-display text-2xl text-zinc-100 tracking-tight leading-tight mt-1">{lock.winner.name.toUpperCase()}</h4>
                  <div className="text-[12px] text-zinc-400 mt-0.5">
                    def. {(lock.winner.id===lock.a.id?lock.b:lock.a).name} · {lock.pred.primary}{lock.pred.roundWin?` · ${lock.pred.roundWin}`:''}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <TierBadge conf={lock.pred.confidence}/>
                    <Pill icon={DollarSign}>{fmtOdds(lock.winnerOdds)}</Pill>
                    <Pill tone={lock.edge>3?'green':'neutral'} icon={Percent}>{lock.edge>0?'+':''}{lock.edge.toFixed(1)}pp edge</Pill>
                  </div>
                </div>
                <div className="hidden sm:block shrink-0">
                  <ConfidenceRing value={lock.wProb} size={96} label="Win Prob"/>
                </div>
              </button>
            </div>
          </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <section className="bg-[#0e0e12] border border-zinc-900">
            <div className="px-5 py-3 border-b border-zinc-900 flex items-center gap-2">
              <Crosshair size={14} className="text-emerald-500"/>
              <h3 className="font-display text-sm tracking-[0.08em] text-zinc-100">TOP VALUE EDGES</h3>
            </div>
            <div className="divide-y divide-zinc-900">
              {[...allFights].sort((a,b)=>b.edge-a.edge).slice(0,4).map((p,i)=>(
                <button key={i} onClick={()=>openFight(p.event,p.bout)}
                  className="group w-full text-left px-5 py-3 hover:bg-[#131318] flex items-center gap-3">
                  <Avatar fighter={p.winner} size={34}/>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-zinc-200 truncate">{p.winner.name}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{p.event.subtitle}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono text-sm tabular-nums font-bold ${p.edge>0?'text-emerald-400':'text-zinc-500'}`}>{p.edge>0?'+':''}{p.edge.toFixed(1)}pp</div>
                    <div className="text-[10px] text-zinc-500 font-mono">{fmtOdds(p.winnerOdds)}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
        <div className="space-y-6">
          <section className="bg-[#0e0e12] border border-zinc-900">
            <div className="px-5 py-3 border-b border-zinc-900 flex items-center gap-2">
              <Activity size={14} className="text-sky-500"/>
              <h3 className="font-display text-sm tracking-[0.08em] text-zinc-100">ELO MOVERS</h3>
            </div>
            <div className="grid grid-cols-2 divide-x divide-zinc-900">
              <div className="p-4">
                <div className="text-[10px] uppercase tracking-[0.12em] text-emerald-500 mb-2 flex items-center gap-1"><TrendingUp size={11}/> Risers</div>
                <div className="space-y-2">
                  {eloMovers.risers.map(m=>(
                    <button key={m.id} onClick={()=>openFighter(m)} className="w-full text-left flex items-center gap-2 hover:opacity-80">
                      <Avatar fighter={m} size={26}/>
                      <span className="text-[11px] text-zinc-300 truncate flex-1">{m.name.split(' ').slice(-1)[0]}</span>
                      <span className="font-mono text-[11px] text-emerald-400">▲{eloDeltaOf(m.id)}</span>
                    </button>
                  ))}
                  {eloMovers.risers.length===0 && <div className="text-[10px] text-zinc-600">No tracked movement yet.</div>}
                </div>
              </div>
              <div className="p-4">
                <div className="text-[10px] uppercase tracking-[0.12em] text-red-500 mb-2 flex items-center gap-1"><TrendingDown size={11}/> Drops</div>
                <div className="space-y-2">
                  {eloMovers.drops.map(m=>(
                    <button key={m.id} onClick={()=>openFighter(m)} className="w-full text-left flex items-center gap-2 hover:opacity-80">
                      <Avatar fighter={m} size={26}/>
                      <span className="text-[11px] text-zinc-300 truncate flex-1">{m.name.split(' ').slice(-1)[0]}</span>
                      <span className="font-mono text-[11px] text-red-400">▼{Math.abs(eloDeltaOf(m.id))}</span>
                    </button>
                  ))}
                  {eloMovers.drops.length===0 && <div className="text-[10px] text-zinc-600">No tracked movement yet.</div>}
                </div>
              </div>
            </div>
          </section>
          <section className="relative overflow-hidden border border-purple-900/40 bg-gradient-to-br from-purple-950/25 via-[#0e0e12] to-[#0e0e12] p-5">
            <Pill tone="purple" icon={ListChecks}>AI Parlay Builder</Pill>
            <h3 className="font-display text-lg text-zinc-100 mt-3 leading-tight">Auto-generated parlays across every card.</h3>
            <p className="text-[12px] text-zinc-400 mt-2 leading-relaxed">
              Safe, value, and longshot parlays built from the model's strongest edges — with combined odds and EV.
            </p>
            <button onClick={()=>setView('betting')}
              className="mt-4 w-full px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-[11px] uppercase tracking-[0.14em] font-semibold">
              Build a parlay
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// EVENTS LIST
// ═══════════════════════════════════════════════════════════════════════

const EventsList = ({ openEvent }) => {
  const [tab, setTab] = useState('upcoming');
  const [q, setQ] = useState('');

  const matchEv = ev => {
    if (!q.trim()) return true;
    const s = q.trim().toLowerCase();
    if ((ev.name+' '+ev.subtitle+' '+(ev.city||'')).toLowerCase().includes(s)) return true;
    return ev.card.some(b=>{ const a=f(b.f1), c=f(b.f2);
      return (a&&a.name.toLowerCase().includes(s))||(c&&c.name.toLowerCase().includes(s)); });
  };
  const upcoming = EVENTS.filter(matchEv);
  const past = PAST_EVENTS.filter(matchEv);
  const list = tab==='upcoming'?upcoming:past;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <PageHead icon={Calendar} tag="Event hub · UFC.com · ESPN · Tapology"
        title="EVENTS"
        desc="Browse every upcoming and completed card. Click any event for the full fight card, per-fight AI predictions and Elo breakdowns."/>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="flex border border-zinc-800 rounded-sm overflow-hidden shrink-0">
          {[['upcoming','Upcoming',EVENTS.length],['past','Past Results',PAST_EVENTS.length]].map(([id,lbl,n])=>(
            <button key={id} onClick={()=>setTab(id)}
              className={`px-4 py-2 text-[12px] font-semibold tracking-wide transition-colors flex items-center gap-1.5 ${
                tab===id?'bg-red-600 text-white':'bg-[#0e0e12] text-zinc-400 hover:text-zinc-100'}`}>
              {id==='past'?<History size={12}/>:<Radio size={12}/>}{lbl}
              <span className="font-mono opacity-60">{n}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 bg-zinc-900/70 border border-zinc-800 rounded-sm">
          <Search size={14} className="text-zinc-500"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search events or fighters…"
            className="flex-1 bg-transparent text-[13px] text-zinc-100 outline-none placeholder:text-zinc-600"/>
          {q && <button onClick={()=>setQ('')} className="text-zinc-600 hover:text-zinc-300"><X size={14}/></button>}
        </div>
      </div>

      {list.length===0 ? (
        <div className="border border-dashed border-zinc-800 rounded-sm p-12 text-center text-[13px] text-zinc-500">
          No {tab==='past'?'completed':'upcoming'} events match “{q}”.
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {list.map(ev=>{
            const ca=f(ev.card[0].f1), cb=f(ev.card[0].f2);
            const isPast = tab==='past';
            let foot;
            if (isPast) {
              const r = ev.card[0].result || {};
              const draw = !r.winner || r.winner==='draw';
              const win = draw?null:f(r.winner);
              const los = draw?null:(r.winner===ev.card[0].f1?cb:ca);
              foot = (
                <div className="text-right shrink-0">
                  <div className="text-[9px] uppercase tracking-[0.12em] text-zinc-600">Main event result</div>
                  {draw
                    ? <div className="text-[13px] text-zinc-300">Draw</div>
                    : <div className="text-[13px] text-zinc-100 truncate max-w-[170px]">
                        <span className="text-emerald-400">{win.name.split(' ').slice(-1)[0]}</span>
                        <span className="text-zinc-500"> def. </span>{los.name.split(' ').slice(-1)[0]}
                      </div>}
                  {!draw && <div className="font-mono text-[11px] text-zinc-500">{r.method}{r.method==='Decision'?'':` · R${r.round}`}</div>}
                </div>
              );
            } else {
              const fights = ev.card.map(b=>predictFight(f(b.f1),f(b.f2),scheduledRounds(b)));
              const avgConf = Math.round(fights.reduce((s,p)=>s+p.confScore,0)/fights.length);
              const finishes = fights.filter(p=>p.primary!=='Decision').length;
              const total = ev.card.length+(ev.prelimCard?ev.prelimCard.length:(ev.prelims?ev.prelims.length:0));
              foot = (
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <div className="text-center"><div className="font-mono text-sm text-sky-400 tabular-nums font-bold">{avgConf}%</div><div className="text-[8px] uppercase tracking-[0.1em] text-zinc-600">conf</div></div>
                  <div className="text-center"><div className="font-mono text-sm text-red-400 tabular-nums font-bold">{finishes}</div><div className="text-[8px] uppercase tracking-[0.1em] text-zinc-600">finish</div></div>
                  <div className="text-center"><div className="font-mono text-sm text-zinc-200 tabular-nums font-bold">{total}</div><div className="text-[8px] uppercase tracking-[0.1em] text-zinc-600">bouts</div></div>
                </div>
              );
            }
            return (
              <button key={ev.id} onClick={()=>openEvent(ev)}
                className="group text-left border border-zinc-900 hover:border-zinc-600 bg-[#0e0e12] overflow-hidden transition-all hover:-translate-y-0.5">
                <div className="relative min-h-[210px] flex flex-col justify-between p-5"
                  style={{ background:`linear-gradient(158deg, ${ev.banner||'#1a1a1f'} 0%, #0b0b0d 72%)` }}>
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background:'radial-gradient(120% 75% at 88% 8%, rgba(255,255,255,0.07), transparent 60%)' }}/>
                  <div className="absolute top-0 inset-x-0 h-[3px]" style={{ background:ev.banner||'#3f3f46' }}/>
                  <div className="relative flex flex-wrap items-center gap-1.5">
                    {isPast
                      ? <Pill tone="neutral" icon={History}>Completed</Pill>
                      : <Pill tone={ev.isPPV?'amber':'neutral'} icon={ev.isPPV?Star:Radio}>{(ev.org||'UFC')}{ev.isPPV?' · PPV':' · Fight Night'}</Pill>}
                    {ev.historic && <Pill tone="red" icon={Flame}>Historic</Pill>}
                  </div>
                  <div className="relative">
                    <div className="font-display text-3xl sm:text-[2.6rem] text-white tracking-tight leading-[0.95]">{ev.subtitle}</div>
                    <div className="text-[12px] text-zinc-300 mt-2 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span className="font-semibold text-zinc-100">{ev.name}</span>
                      <span className="flex items-center gap-1"><Calendar size={11}/>{ev.date}</span>
                      <span className="flex items-center gap-1"><MapPin size={11}/>{ev.venue}, {ev.city}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between gap-3 group-hover:bg-[#101015] transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar fighter={ca} size={42}/>
                    <span className="font-display text-zinc-600 text-sm">VS</span>
                    <Avatar fighter={cb} size={42} mirror/>
                  </div>
                  {foot}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// EVENT DETAIL
// ═══════════════════════════════════════════════════════════════════════

const EventDetail = ({ event, openFight, setView }) => {
  if (!event) return null;
  const mainCard = event.card;
  const prelimCard = event.prelimCard || [];
  const headliner = mainCard[0];
  const coMain = mainCard[1];
  const ha = f(headliner.f1), hb = f(headliner.f2);
  const hPred = predictFight(ha,hb,scheduledRounds(headliner));
  const hWinner = hPred.aProb>50?ha:hb;

  const allBouts = [...mainCard, ...prelimCard];
  const preds = allBouts.map(b=>predictFight(f(b.f1),f(b.f2),scheduledRounds(b)));
  const avgConf = Math.round(preds.reduce((s,p)=>s+p.confScore,0)/preds.length);
  const finishes = preds.filter(p=>p.primary!=='Decision').length;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
      <button onClick={()=>setView('events')} className="text-[11px] uppercase tracking-[0.14em] text-zinc-500 hover:text-zinc-200 flex items-center gap-1 mb-4">
        <ArrowRight size={12} className="rotate-180"/> All events
      </button>

      {/* CLEAN PROFESSIONAL HERO */}
      <div className="relative border border-zinc-800/80 overflow-hidden mb-5 bg-[#0c0c10]">
        <div className="absolute inset-0" style={{
          background:`radial-gradient(110% 90% at 90% 0%, ${event.banner}, transparent 58%)`, opacity:0.6 }}/>
        <div className="absolute top-0 inset-x-0 h-[3px]" style={{ background:event.banner }}/>
        <div className="relative p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Pill tone={event.isPPV?'amber':'neutral'} icon={event.isPPV?Star:Radio}>{event.org||'UFC'}{event.isPPV?' · PPV':' · Fight Night'}</Pill>
            <Pill icon={Calendar}>{event.date}</Pill>
            <Pill icon={MapPin}>{event.venue}, {event.city}</Pill>
            {event.historic && <Pill tone="red" icon={Flame}>Historic</Pill>}
          </div>
          <h1 className="font-display text-3xl sm:text-5xl text-zinc-100 tracking-tight leading-none">{event.name}</h1>
          <div className="font-display text-lg sm:text-2xl text-red-400 tracking-tight mt-1">{event.subtitle}</div>
          <p className="text-[12px] sm:text-[13px] text-zinc-400 mt-3 max-w-2xl leading-relaxed">{event.note}</p>

          {/* headliner faceoff — prominent, readable */}
          <div className="mt-6 grid sm:grid-cols-[1fr_auto] gap-5 items-center">
            <div className="bg-[#08080a]/70 border border-zinc-800 p-4">
              <div className="text-[9px] uppercase tracking-[0.16em] text-red-400 mb-3">Main Event · {headliner.division}</div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="flex items-center gap-3 justify-end min-w-0">
                  <div className="text-right min-w-0">
                    <div className="font-display text-base sm:text-xl text-zinc-100 tracking-tight truncate">{ha.name.toUpperCase()}</div>
                    <div className="font-mono text-[10px] text-zinc-500">{ha.country} {ha.record}</div>
                  </div>
                  <Avatar fighter={ha} size={70}/>
                </div>
                <span className="font-display text-2xl text-zinc-700">VS</span>
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar fighter={hb} size={70} mirror/>
                  <div className="min-w-0">
                    <div className="font-display text-base sm:text-xl text-zinc-100 tracking-tight truncate">{hb.name.toUpperCase()}</div>
                    <div className="font-mono text-[10px] text-zinc-500">{hb.country} {hb.record}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#08080a]/70 border border-zinc-800 px-5 py-4">
              <div className="text-[9px] uppercase tracking-[0.16em] text-zinc-500 mb-2">Countdown</div>
              <Countdown iso={event.dateISO}/>
              <div className="flex gap-4 mt-3 pt-3 border-t border-zinc-900">
                <div><div className="font-mono text-base text-sky-400 tabular-nums font-bold">{avgConf}%</div><div className="text-[8px] uppercase tracking-[0.1em] text-zinc-600">avg conf</div></div>
                <div><div className="font-mono text-base text-red-400 tabular-nums font-bold">{finishes}</div><div className="text-[8px] uppercase tracking-[0.1em] text-zinc-600">finishes</div></div>
                <div><div className="font-mono text-base text-zinc-200 tabular-nums font-bold">{allBouts.length}</div><div className="text-[8px] uppercase tracking-[0.1em] text-zinc-600">bouts</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURED FIGHT */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Flame size={15} className="text-red-500"/>
          <h2 className="font-display text-lg tracking-[0.08em] text-zinc-100">FEATURED FIGHT · AI BREAKDOWN</h2>
        </div>
        <button onClick={()=>openFight(event,headliner)}
          className="group w-full text-left bg-gradient-to-br from-red-950/25 via-[#0e0e12] to-[#0e0e12] border border-red-900/50 hover:border-red-700 transition-colors p-5">
          <div className="grid sm:grid-cols-[auto_1fr] gap-5 items-center">
            <ConfidenceRing value={Math.max(hPred.aProb,hPred.bProb)} size={104} label="Win Prob" sublabel={hWinner.name.split(' ').slice(-1)[0]}/>
            <div>
              <div className="font-display text-xl text-zinc-100 tracking-tight">{ha.name.toUpperCase()} <span className="text-zinc-600">vs</span> {hb.name.toUpperCase()}</div>
              <div className="text-[12px] text-zinc-400 mt-1.5 leading-relaxed">{buildExplanation(ha,hb,hPred)}</div>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <TierBadge conf={hPred.confidence}/>
                <Pill icon={Cpu}>{hPred.primary} · {hPred.primaryProb}%</Pill>
                {hPred.roundWin && <Pill icon={Clock}>{hPred.roundWin}</Pill>}
                <Pill tone="amber" icon={AlertTriangle}>Upset risk {(100-hPred.confScore)}%</Pill>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* MAIN CARD */}
      <div className="flex items-center gap-2 mb-3">
        <Layers size={15} className="text-zinc-500"/>
        <h2 className="font-display text-lg tracking-[0.08em] text-zinc-100">MAIN CARD</h2>
        <span className="text-[10px] text-zinc-600 font-mono">{mainCard.length} bouts</span>
      </div>
      <div className="space-y-3 mb-6">
        {mainCard.map((bout,i)=>(
          <FightRow key={i} event={event} bout={bout} featured={i<=1}
            onClick={()=>openFight(event,bout)}/>
        ))}
      </div>

      {/* PRELIMINARY CARD */}
      <div className="flex items-center gap-2 mb-3">
        <ListChecks size={15} className="text-zinc-500"/>
        <h2 className="font-display text-lg tracking-[0.08em] text-zinc-100">PRELIMINARY CARD</h2>
        <span className="text-[10px] text-zinc-600 font-mono">{prelimCard.length||(event.prelims?event.prelims.length:0)} bouts</span>
      </div>
      {prelimCard.length>0 ? (
        <div className="space-y-3">
          {prelimCard.map((bout,i)=>(
            <FightRow key={i} event={event} bout={bout}
              onClick={()=>openFight(event,bout)}/>
          ))}
        </div>
      ) : (
        <div className="bg-[#0e0e12] border border-zinc-900 divide-y divide-zinc-900">
          {(event.prelims||[]).map((bout,i)=>(
            <div key={i} className="px-4 py-3 flex items-center gap-3 text-sm">
              <span className="font-mono text-[10px] text-zinc-700 w-6">P{i+1}</span>
              <span className="text-zinc-400">{bout}</span>
            </div>
          ))}
          <div className="px-4 py-3 text-[10px] text-zinc-600">
            Full per-fight predictions for this card's prelims will populate once complete fighter profiles are added.
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// FIGHT DETAIL
// ═══════════════════════════════════════════════════════════════════════

const FightDetail = ({ selected, setView, openEvent }) => {
  if (!selected) return null;
  const { event, bout } = selected;
  const a = f(bout.f1), b = f(bout.f2);
  const pred = predictFight(a,b,scheduledRounds(bout));
  const markets = generateMarkets(a,b,pred,bout.odds);
  const explanation = buildExplanation(a,b,pred);
  const boutRounds = scheduledRounds(bout);
  const boutSlot = bout.slot || 'Completed Bout';
  const winner = pred.aProb>50?a:b;
  const loser = pred.aProb>50?b:a;
  const modelLine = { f1:probToAmerican(pred.aProb), f2:probToAmerican(pred.bProb) };
  const marketImpl = bout.odds ? { f1:impliedProb(bout.odds.f1), f2:impliedProb(bout.odds.f2) } : null;
  const edge = marketImpl ? { f1:pred.aProb-marketImpl.f1, f2:pred.bProb-marketImpl.f2 } : null;

  const radar = [
    { stat:'SLpM', a:(a.slpm??0)*10, b:(b.slpm??0)*10 },
    { stat:'Str Acc', a:a.strAcc??0, b:b.strAcc??0 },
    { stat:'TD/15m', a:(a.tdAvg??0)*15, b:(b.tdAvg??0)*15 },
    { stat:'TD Acc', a:a.tdAcc??0, b:b.tdAcc??0 },
    { stat:'Subs', a:(a.subAvg??0)*30, b:(b.subAvg??0)*30 },
    { stat:'Win%', a:pred.comp.aPct, b:pred.comp.bPct },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-4 text-[11px] uppercase tracking-[0.14em]">
        <button onClick={()=>setView('events')} className="text-zinc-500 hover:text-zinc-200 flex items-center gap-1">
          <ArrowRight size={12} className="rotate-180"/> Events
        </button>
        <span className="text-zinc-700">/</span>
        <button onClick={()=>openEvent(event)} className="text-zinc-500 hover:text-zinc-200">{event.subtitle}</button>
      </div>

      {/* CLEAN FIGHT HERO */}
      <div className="relative border border-zinc-800/80 overflow-hidden bg-[#0c0c10]">
        <div className="absolute inset-0" style={{
          background:`radial-gradient(100% 80% at 50% 0%, ${event.banner}, transparent 60%)`, opacity:0.45 }}/>
        <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background:event.banner }}/>
        <div className="relative p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <Pill tone="red" icon={Flame}>{boutSlot}</Pill>
            <Pill icon={Calendar}>{event.date}</Pill>
            <Pill icon={MapPin}>{event.city}</Pill>
            {bout.titleFight && <Pill tone="amber" icon={Trophy}>Title Fight</Pill>}
            <Pill>{boutRounds}R · {bout.division}</Pill>
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
            <div className="text-right min-w-0">
              <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">{a.country} · {a.rank==='C'?'CHAMP':a.rank?`#${a.rank}`:'Unranked'}</div>
              <h1 className="font-display text-2xl sm:text-4xl tracking-tight text-zinc-100 leading-[0.95] mt-1">{a.name.toUpperCase()}</h1>
              <div className="text-[11px] text-zinc-400 italic mt-1 truncate">"{a.nick}" · {a.style}</div>
              <div className="font-mono text-xs sm:text-sm text-zinc-300 mt-2">{a.record} · <span className="text-emerald-400">{a.streak}</span></div>
              <div className="hidden sm:flex justify-end mt-3"><Avatar fighter={a} size={104}/></div>
            </div>
            <div className="font-display text-zinc-700 text-3xl sm:text-6xl leading-none tracking-tighter shrink-0">VS</div>
            <div className="text-left min-w-0">
              <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">{b.country} · {b.rank==='C'?'CHAMP':b.rank?`#${b.rank}`:'Unranked'}</div>
              <h1 className="font-display text-2xl sm:text-4xl tracking-tight text-zinc-100 leading-[0.95] mt-1">{b.name.toUpperCase()}</h1>
              <div className="text-[11px] text-zinc-400 italic mt-1 truncate">"{b.nick}" · {b.style}</div>
              <div className="font-mono text-xs sm:text-sm text-zinc-300 mt-2">{b.record} · <span className="text-emerald-400">{b.streak}</span></div>
              <div className="hidden sm:flex mt-3"><Avatar fighter={b} size={104} mirror/></div>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-400 flex items-center gap-1.5"><Cpu size={11} className="text-red-500"/> Model Win Probability</span>
              <span className="text-[10px] text-zinc-500 font-mono">Heuristic v1.0</span>
            </div>
            <div className="flex h-6 bg-zinc-900 overflow-hidden border border-zinc-900">
              <div className="h-full bg-red-600 flex items-center px-2 sm:px-3" style={{width:`${pred.aProb}%`}}>
                <span className="font-mono text-[11px] sm:text-xs text-white font-bold">{pred.aProb}%</span>
              </div>
              <div className="h-full bg-amber-600 flex items-center justify-end px-2 sm:px-3" style={{width:`${pred.bProb}%`}}>
                <span className="font-mono text-[11px] sm:text-xs text-white font-bold">{pred.bProb}%</span>
              </div>
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-zinc-500">
              <span>{a.name.split(' ').slice(-1)[0]}</span><span>{b.name.split(' ').slice(-1)[0]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mt-4">
        <section className="col-span-12 lg:col-span-6 bg-[#0e0e12] border border-zinc-900 p-5">
          <h3 className="font-display text-lg tracking-tight text-zinc-100 mb-4 flex items-center gap-2"><Layers size={14} className="text-zinc-500"/> TALE OF THE TAPE</h3>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3 pb-3 mb-1 border-b border-zinc-800">
            <div className="flex items-center gap-2 justify-end min-w-0">
              <span className="font-display text-[13px] sm:text-sm text-zinc-100 truncate">{a.name.split(' ').slice(-1)[0].toUpperCase()}</span>
              <Avatar fighter={a} size={34}/>
            </div>
            <div className="px-2 sm:px-3 min-w-[64px] sm:min-w-[88px] text-center text-[9px] uppercase tracking-[0.12em] text-zinc-600">Metric</div>
            <div className="flex items-center gap-2 min-w-0">
              <Avatar fighter={b} size={34} mirror/>
              <span className="font-display text-[13px] sm:text-sm text-zinc-100 truncate">{b.name.split(' ').slice(-1)[0].toUpperCase()}</span>
            </div>
          </div>
          <div className="divide-y divide-zinc-900/70">
            {[
              ['Age',a.age,b.age,'lo'],['Height',a.height,b.height,'-'],['Reach',`${a.reach}"`,`${b.reach}"`,'hi'],
              ['Stance',a.stance,b.stance,'-'],['Record',a.record,b.record,'-'],['Form',a.streak,b.streak,'-'],
              ['SLpM',a.slpm,b.slpm,'hi'],['Str Acc',`${a.strAcc}%`,`${b.strAcc}%`,'hi'],
              ['TD/15m',a.tdAvg,b.tdAvg,'hi'],['TD Acc',`${a.tdAcc}%`,`${b.tdAcc}%`,'hi'],['Subs/15m',a.subAvg,b.subAvg,'hi'],
            ].map(([l,v1,v2,d])=>{
              const n1=parseFloat(v1),n2=parseFloat(v2);
              let b1=false,b2=false;
              if(!isNaN(n1)&&!isNaN(n2)&&d!=='-'){ if(d==='hi'){b1=n1>n2;b2=n2>n1;}else{b1=n1<n2;b2=n2<n1;} }
              return (
                <div key={l} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3 py-2.5">
                  <div className={`text-right font-mono text-[13px] tabular-nums whitespace-nowrap ${b1?'text-red-400 font-bold':'text-zinc-300'}`}>{v1}</div>
                  <div className="px-2 sm:px-3 min-w-[64px] sm:min-w-[88px] text-center text-[9px] sm:text-[10px] uppercase tracking-[0.1em] text-zinc-500 whitespace-nowrap">{l}</div>
                  <div className={`text-left font-mono text-[13px] tabular-nums whitespace-nowrap ${b2?'text-red-400 font-bold':'text-zinc-300'}`}>{v2}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="col-span-12 lg:col-span-6 bg-[#0e0e12] border border-zinc-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg tracking-tight text-zinc-100 flex items-center gap-2"><Cpu size={14} className="text-red-500"/> AI PREDICTION</h3>
            <TierBadge conf={pred.confidence}/>
          </div>
          <div className="flex flex-col sm:flex-row gap-5 items-center">
            <ConfidenceRing value={Math.max(pred.aProb,pred.bProb)} size={140} label="Win Probability" sublabel={winner.name.split(' ').slice(-1)[0]}/>
            <div className="space-y-2 w-full">
              {[
                ['Predicted winner', winner.name, 'text-zinc-100'],
                ['Method of victory', `${pred.primary} (${pred.primaryProb}%)`, 'text-zinc-200'],
                ...(pred.roundWin ? [['Round window', pred.roundWin, 'text-zinc-200']] : []),
                ['Finish probability', `${pred.finishPct}%`, 'text-zinc-200'],
                ['Moneyline projection', `${fmtOdds(modelLine.f1)} / ${fmtOdds(modelLine.f2)}`, 'text-sky-300'],
                ['Upset probability', `${100-pred.confScore}%`, 'text-amber-300'],
                ['Risk score', `${pred.risk} / 10`, 'text-zinc-200'],
              ].map(([l,v,c])=>(
                <div key={l} className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">{l}</span>
                  <span className={`font-mono text-sm ${c}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-900">
            <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500 mb-2">Method probability breakdown</div>
            <div className="space-y-1.5">
              {pred.methods.map(m=>(
                <div key={m.name} className="grid grid-cols-[110px_1fr_40px] items-center gap-3 text-[11px]">
                  <span className="text-zinc-300">{m.name}</span>
                  <div className="h-1.5 bg-zinc-900 overflow-hidden">
                    <div className="h-full" style={{width:`${m.value*2}%`,background:m.color}}/>
                  </div>
                  <span className="font-mono text-zinc-400 text-right">{m.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-7 bg-[#0e0e12] border border-zinc-900 p-5">
          <h3 className="font-display text-lg tracking-tight text-zinc-100 mb-4 flex items-center gap-2"><Sparkles size={14} className="text-red-500"/> AI WRITTEN ANALYSIS</h3>
          <div className="relative">
            <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-gradient-to-b from-red-600 to-transparent"/>
            <p className="text-[13px] leading-[1.7] text-zinc-300 pl-4 font-light">{explanation}</p>
          </div>
          <div className="mt-4 pl-4 text-[12px] text-zinc-400 leading-relaxed">
            <span className="text-zinc-200 font-medium">Win condition — {winner.name.split(' ').slice(-1)[0]}:</span>{' '}
            {pred.primary==='KO/TKO' ? `Land power early and capitalize on ${loser.name.split(' ').slice(-1)[0]}'s exchanges before the later rounds.`
              : pred.primary==='Submission' ? `Convert grappling exchanges into dominant position and hunt the finish off scrambles.`
              : `Control distance and out-land over ${boutRounds} rounds, banking rounds on the scorecards.`}
          </div>
          <div className="mt-5 pt-4 border-t border-zinc-900">
            <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500 mb-3">Rating composition</div>
            <div className="space-y-2 text-xs">
              {[
                ['Striking output (SLpM × Acc)',pred.comp.aStrike,pred.comp.bStrike,'×0.85'],
                ['Grappling threat',pred.comp.aGrap,pred.comp.bGrap,'×0.65'],
                ['Win % differential',pred.comp.aPct+'%',pred.comp.bPct+'%','×0.7'],
                ['Age penalty (subtracted)',pred.comp.aAge,pred.comp.bAge,'−'],
              ].map(([l,v1,v2,m])=>(
                <div key={l} className="grid grid-cols-[1fr_60px_60px_44px] items-center gap-2">
                  <span className="text-zinc-400">{l}</span>
                  <span className="font-mono text-right text-zinc-300">{v1}</span>
                  <span className="font-mono text-right text-zinc-300">{v2}</span>
                  <span className="font-mono text-right text-zinc-600 text-[10px]">{m}</span>
                </div>
              ))}
              <div className="grid grid-cols-[1fr_60px_60px_44px] items-center gap-2 pt-2 border-t border-zinc-900 font-bold">
                <span className="text-zinc-200 text-[11px] uppercase tracking-[0.12em]">Final rating</span>
                <span className="font-mono text-right text-zinc-100">{pred.aRating}</span>
                <span className="font-mono text-right text-zinc-100">{pred.bRating}</span>
                <span className="font-mono text-right text-red-400 text-[10px]">Δ{pred.ratingDiff}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-5 bg-[#0e0e12] border border-zinc-900 p-5">
          <h3 className="font-display text-lg tracking-tight text-zinc-100 mb-1 flex items-center gap-2"><Target size={14} className="text-zinc-500"/> ATHLETIC PROFILE</h3>
          <p className="text-[11px] text-zinc-500 mb-2">Statistical comparison, normalized</p>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radar}>
              <PolarGrid stroke="#27272a"/>
              <PolarAngleAxis dataKey="stat" tick={{fill:'#a1a1aa',fontSize:10,fontFamily:'monospace'}}/>
              <PolarRadiusAxis stroke="#27272a" tick={false} axisLine={false}/>
              <Radar dataKey="a" stroke="#dc2626" fill="#dc2626" fillOpacity={0.25} strokeWidth={2}/>
              <Radar dataKey="b" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.18} strokeWidth={2}/>
              <Tooltip contentStyle={{background:'#0a0a0c',border:'1px solid #27272a',fontSize:11,fontFamily:'monospace'}}/>
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-5 text-[10px]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-600"/><span className="text-zinc-400">{a.name.split(' ').slice(-1)[0]}</span></span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-500"/><span className="text-zinc-400">{b.name.split(' ').slice(-1)[0]}</span></span>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-6 bg-[#0e0e12] border border-zinc-900 p-5">
          <h3 className="font-display text-lg tracking-tight text-zinc-100 mb-1 flex items-center gap-2"><BarChart3 size={14} className="text-zinc-500"/> ROUND-BY-ROUND FINISH PROJECTION</h3>
          <p className="text-[11px] text-zinc-500 mb-3">Probability the fight ends in each round (either fighter)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pred.rbr}>
              <CartesianGrid stroke="#1f1f26" vertical={false}/>
              <XAxis dataKey="round" stroke="#52525b" fontSize={10} tick={{fontFamily:'monospace'}}/>
              <YAxis stroke="#52525b" fontSize={10} unit="%" tick={{fontFamily:'monospace'}}/>
              <Tooltip contentStyle={{background:'#0a0a0c',border:'1px solid #27272a',fontSize:11,fontFamily:'monospace'}}/>
              <Bar dataKey="finish" fill="#dc2626" radius={[2,2,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="col-span-12 lg:col-span-6 bg-[#0e0e12] border border-zinc-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg tracking-tight text-zinc-100 flex items-center gap-2"><DollarSign size={14} className="text-emerald-500"/> BETTING MARKETS</h3>
            <Pill tone={markets.isRealOdds?'green':'amber'}>{markets.isRealOdds?'Real ML odds':'Model-projected'}</Pill>
          </div>
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 mb-2">Moneyline</div>
            <div className="grid grid-cols-2 gap-2">
              {[[a,markets.moneyline.f1,pred.aProb],[b,markets.moneyline.f2,pred.bProb]].map(([fr,od,pr],i)=>(
                <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-2.5">
                  <div className="text-xs text-zinc-300 truncate">{fr.name.split(' ').slice(-1)[0]}</div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-mono text-base text-zinc-100 tabular-nums">{fmtOdds(od)}</span>
                    <span className="font-mono text-[10px] text-red-400">{pr}% model</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 mb-2">Method props</div>
              <div className="space-y-1.5">
                {markets.method.map((m,i)=>(
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400 truncate">{m.label}</span>
                    <span className="font-mono text-zinc-300 ml-2">{fmtOdds(m.odds)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 mb-2">Total rounds (O/U {markets.total.line})</div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between"><span className="text-zinc-400">Over {markets.total.line}</span><span className="font-mono text-zinc-300">{fmtOdds(markets.total.over.odds)}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Under {markets.total.line}</span><span className="font-mono text-zinc-300">{fmtOdds(markets.total.under.odds)}</span></div>
              </div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 mb-2 mt-3">Finish / no finish</div>
              <div className="space-y-1.5 text-[11px]">
                {markets.finish.map((m,i)=>(
                  <div key={i} className="flex justify-between"><span className="text-zinc-400 truncate">{m.label}</span><span className="font-mono text-zinc-300 ml-2">{fmtOdds(m.odds)}</span></div>
                ))}
              </div>
            </div>
          </div>
          {edge && Math.abs(edge.f1)>5 && (
            <div className="mt-4 pt-3 border-t border-zinc-900 text-[11px] text-amber-300 flex items-start gap-2">
              <AlertCircle size={13} className="mt-0.5 shrink-0"/>
              <span>Model differs from market by {Math.abs(edge.f1).toFixed(1)}pp on {edge.f1>0?a.name:b.name}. Discussion point, not betting advice — the heuristic is uncalibrated.</span>
            </div>
          )}
        </section>

        <section className="col-span-12 bg-[#0e0e12] border border-zinc-900 p-5">
          <h3 className="font-display text-lg tracking-tight text-zinc-100 mb-3 flex items-center gap-2"><BookOpen size={14} className="text-zinc-500"/> SCOUTING NOTES</h3>
          <div className="grid sm:grid-cols-2 gap-5">
            {[a,b].map(fr=>(
              <div key={fr.id} className="group flex gap-3">
                <Avatar fighter={fr} size={56}/>
                <div className="min-w-0">
                  <span className="font-display text-sm text-zinc-100">{fr.name.toUpperCase()}</span>
                  <p className="text-[12px] text-zinc-400 leading-relaxed mt-0.5">{fr.notes}</p>
                  <div className="mt-1.5 text-[10px] text-zinc-600 font-mono">Camp: {fr.camp} · Last: {fr.last}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
// ═══════════════════════════════════════════════════════════════════════
// AI PICKS
// ═══════════════════════════════════════════════════════════════════════

const AiPicks = ({ openFight }) => {
  const allFights = useMemo(()=>getAllFights(),[]);
  const [sort, setSort] = useState('confidence');
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(()=>{
    let arr = [...allFights];
    if (filter==='underdogs') arr = arr.filter(x=>x.isUnderdog);
    if (filter==='favorites') arr = arr.filter(x=>!x.isUnderdog);
    if (filter==='finishes') arr = arr.filter(x=>x.pred.primary!=='Decision');
    if (sort==='confidence') arr.sort((a,b)=>b.wProb-a.wProb);
    if (sort==='value') arr.sort((a,b)=>b.edge-a.edge);
    if (sort==='finish') arr.sort((a,b)=>b.pred.finishPct-a.pred.finishPct);
    return arr;
  },[allFights,sort,filter]);

  const tiers = [
    { name:'Elite', min:75, color:'#a855f7' },
    { name:'High', min:65, color:'#22c55e' },
    { name:'Medium', min:55, color:'#f59e0b' },
    { name:'Coinflip', min:0, color:'#71717a' },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <PageHead icon={Sparkles} tag="Ranked across all 7 cards" title="AI PICKS"
        desc="Every main-card fight ranked by the model. Filter and sort to find favorites, underdogs, or likely finishes."/>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-600 mr-1">Sort</span>
        {[['confidence','Confidence'],['value','Value'],['finish','Finish %']].map(([k,l])=>(
          <button key={k} onClick={()=>setSort(k)}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] border ${sort===k?'bg-red-950/50 border-red-900 text-red-300':'border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>{l}</button>
        ))}
        <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-600 mx-1 ml-3">Filter</span>
        {[['all','All'],['favorites','Favorites'],['underdogs','Underdogs'],['finishes','Finishes']].map(([k,l])=>(
          <button key={k} onClick={()=>setFilter(k)}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] border ${filter===k?'bg-sky-950/50 border-sky-900 text-sky-300':'border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>{l}</button>
        ))}
      </div>
      {tiers.map(tier=>{
        const idx = tiers.indexOf(tier);
        const next = tiers[idx-1];
        const inTier = filtered.filter(x=>x.wProb>=tier.min && (!next || x.wProb<next.min));
        if (!inTier.length) return null;
        return (
          <div key={tier.name} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{background:tier.color}}/>
              <h3 className="font-display text-lg tracking-tight text-zinc-100">{tier.name.toUpperCase()} TIER</h3>
              <span className="text-[10px] text-zinc-600 font-mono">{inTier.length} picks · {tier.min}%+</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {inTier.map((p,i)=>{
                const trend = ['up','flat','down'][(i+p.winner.name.length)%3];
                return (
                  <button key={i} onClick={()=>openFight(p.event,p.bout)}
                    className="text-left bg-[#0e0e12] border border-zinc-900 hover:border-zinc-700 transition-colors p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.14em]">{p.event.subtitle}</span>
                      {trend==='up' && <ArrowUp size={13} className="text-emerald-500"/>}
                      {trend==='down' && <ArrowDown size={13} className="text-red-500"/>}
                      {trend==='flat' && <Minus size={13} className="text-zinc-600"/>}
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar fighter={p.winner} size={48}/>
                      <div className="min-w-0">
                        <div className="font-display text-base text-zinc-100 tracking-tight truncate">{p.winner.name.toUpperCase()}</div>
                        <div className="text-[10px] text-zinc-500 truncate">def. {(p.winner.id===p.a.id?p.b:p.a).name.split(' ').slice(-1)[0]}</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-zinc-900 grid grid-cols-2 gap-2 text-[11px]">
                      <div><span className="text-zinc-600 text-[9px] uppercase tracking-[0.1em] block">Confidence</span><span className="font-mono text-red-400 font-bold">{p.wProb.toFixed(1)}%</span></div>
                      <div><span className="text-zinc-600 text-[9px] uppercase tracking-[0.1em] block">Odds</span><span className="font-mono text-amber-400">{fmtOdds(p.winnerOdds)}</span></div>
                      <div><span className="text-zinc-600 text-[9px] uppercase tracking-[0.1em] block">Method</span><span className="text-zinc-200 font-mono">{p.pred.primary}</span></div>
                      <div><span className="text-zinc-600 text-[9px] uppercase tracking-[0.1em] block">Edge</span><span className={`font-mono ${p.edge>3?'text-emerald-400':'text-zinc-400'}`}>{p.edge>0?'+':''}{p.edge.toFixed(1)}pp</span></div>
                    </div>
                    <div className="mt-2 text-[10px] text-zinc-500 leading-snug">
                      {p.pred.confidence} confidence{p.pred.roundWin?` · ${p.pred.roundWin}`:''} · risk {p.pred.risk}/10
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PARLAYS
// ═══════════════════════════════════════════════════════════════════════

const Parlays = ({ openFight }) => {
  const allFights = useMemo(()=>getAllFights(),[]);
  const [legs, setLegs] = useState([]);

  const safe = [...allFights].sort((a,b)=>b.wProb-a.wProb).slice(0,3);
  const value = [...allFights].sort((a,b)=>b.edge-a.edge).slice(0,3);
  const longshot = [...allFights].filter(x=>x.isUnderdog).sort((a,b)=>b.wProb-a.wProb).slice(0,3);
  const methodParlay = [...allFights].filter(x=>x.pred.primary!=='Decision').sort((a,b)=>b.pred.finishPct-a.pred.finishPct).slice(0,3);

  const computeParlay = (picks) => {
    if (!picks.length) return { decimal:0, american:0, hitProb:0, ev:0 };
    const decimal = picks.reduce((p,x)=>p*americanToDecimal(x.winnerOdds),1);
    const hitProb = picks.reduce((p,x)=>p*(x.wProb/100),1)*100;
    const american = decimal>=2 ? Math.round((decimal-1)*100) : -Math.round(100/(decimal-1));
    const ev = ((hitProb/100)*(decimal-1) - (1-hitProb/100))*100;
    return { decimal:+decimal.toFixed(2), american, hitProb:+hitProb.toFixed(1), ev:+ev.toFixed(1) };
  };
  const toggleLeg = (fight) => {
    setLegs(prev => prev.find(l=>l.bout===fight.bout)
      ? prev.filter(l=>l.bout!==fight.bout) : [...prev, fight]);
  };
  const custom = computeParlay(legs);

  const PresetCard = ({ title, picks, tone, desc }) => {
    const calc = computeParlay(picks);
    return (
      <div className="bg-[#0e0e12] border border-zinc-900 p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display text-lg tracking-tight text-zinc-100">{title}</h3>
          <Pill tone={tone}>{picks.length} legs</Pill>
        </div>
        <p className="text-[11px] text-zinc-500 mb-3">{desc}</p>
        <div className="space-y-2">
          {picks.map((p,i)=>(
            <button key={i} onClick={()=>openFight(p.event,p.bout)}
              className="w-full text-left flex items-center gap-3 py-2 border-b border-zinc-900/50 hover:bg-zinc-900/30">
              <Avatar fighter={p.winner} size={30}/>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-zinc-200 truncate">{p.winner.name}</div>
                <div className="text-[10px] text-zinc-500 truncate">{p.event.subtitle} · {p.pred.primary}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs text-zinc-300">{fmtOdds(p.winnerOdds)}</div>
                <div className="font-mono text-[10px] text-red-400">{p.wProb.toFixed(0)}%</div>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-zinc-900 grid grid-cols-4 gap-2 text-center">
          <div><div className="font-mono text-sm text-amber-400 tabular-nums font-bold">{fmtOdds(calc.american)}</div><div className="text-[8px] uppercase tracking-[0.1em] text-zinc-600">odds</div></div>
          <div><div className="font-mono text-sm text-zinc-200 tabular-nums font-bold">{calc.decimal}x</div><div className="text-[8px] uppercase tracking-[0.1em] text-zinc-600">payout</div></div>
          <div><div className="font-mono text-sm text-sky-400 tabular-nums font-bold">{calc.hitProb}%</div><div className="text-[8px] uppercase tracking-[0.1em] text-zinc-600">hit prob</div></div>
          <div><div className={`font-mono text-sm tabular-nums font-bold ${calc.ev>0?'text-emerald-400':'text-red-400'}`}>{calc.ev>0?'+':''}{calc.ev}%</div><div className="text-[8px] uppercase tracking-[0.1em] text-zinc-600">EV</div></div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <PageHead icon={ListChecks} tag="AI Parlay Builder" title="PARLAYS"
        desc="Auto-generated parlays from the model's strongest signals, plus a custom builder. Combined odds, hit probability and EV shown for each."/>
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <PresetCard title="Safe Parlay" picks={safe} tone="green" desc="Three highest win-probability picks across all cards."/>
        <PresetCard title="Value Parlay" picks={value} tone="amber" desc="Largest model-vs-market edges — higher variance."/>
        <PresetCard title="Longshot Parlay" picks={longshot.length?longshot:safe} tone="red" desc="Underdog picks the model still rates highly. High risk."/>
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <PresetCard title="Method Prop Parlay" picks={methodParlay} tone="purple" desc="Fights most likely to end inside the distance."/>
        <div className="bg-[#0e0e12] border border-zinc-900 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg tracking-tight text-zinc-100">CUSTOM BUILDER</h3>
            <Pill tone="blue">{legs.length} legs selected</Pill>
          </div>
          {legs.length===0 && <p className="text-[12px] text-zinc-500 mb-3">Pick fighters from the list below to build your own parlay.</p>}
          {legs.length>0 && (
            <>
              <div className="space-y-1.5 mb-3">
                {legs.map((p,i)=>(
                  <div key={i} className="flex items-center gap-2 text-[11px] py-1.5 border-b border-zinc-900/50">
                    <Avatar fighter={p.winner} size={24}/>
                    <span className="text-zinc-200 flex-1 truncate">{p.winner.name}</span>
                    <span className="font-mono text-zinc-400">{fmtOdds(p.winnerOdds)}</span>
                    <button onClick={()=>toggleLeg(p)} className="text-zinc-600 hover:text-red-400"><X size={13}/></button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-2 text-center pt-3 border-t border-zinc-900">
                <div><div className="font-mono text-base text-amber-400 tabular-nums font-bold">{fmtOdds(custom.american)}</div><div className="text-[8px] uppercase tracking-[0.1em] text-zinc-600">odds</div></div>
                <div><div className="font-mono text-base text-zinc-200 tabular-nums font-bold">{custom.decimal}x</div><div className="text-[8px] uppercase tracking-[0.1em] text-zinc-600">payout</div></div>
                <div><div className="font-mono text-base text-sky-400 tabular-nums font-bold">{custom.hitProb}%</div><div className="text-[8px] uppercase tracking-[0.1em] text-zinc-600">hit prob</div></div>
                <div><div className={`font-mono text-base tabular-nums font-bold ${custom.ev>0?'text-emerald-400':'text-red-400'}`}>{custom.ev>0?'+':''}{custom.ev}%</div><div className="text-[8px] uppercase tracking-[0.1em] text-zinc-600">EV</div></div>
              </div>
              <div className="mt-2 text-[10px] text-zinc-500">$100 stake returns ${(custom.decimal*100).toFixed(0)} if all {legs.length} legs hit.</div>
            </>
          )}
        </div>
      </div>
      <h3 className="font-display text-lg tracking-tight text-zinc-100 mb-3">ADD LEGS · ALL MAIN-CARD FIGHTS</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {allFights.map((p,i)=>{
          const inParlay = legs.find(l=>l.bout===p.bout);
          return (
            <button key={i} onClick={()=>toggleLeg(p)}
              className={`text-left p-3 border transition-colors flex items-center gap-3 ${inParlay?'bg-sky-950/30 border-sky-900':'bg-[#0e0e12] border-zinc-900 hover:border-zinc-700'}`}>
              <Avatar fighter={p.winner} size={34}/>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-zinc-200 truncate">{p.winner.name}</div>
                <div className="text-[10px] text-zinc-500 truncate">{p.event.subtitle}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[11px] text-red-400">{p.wProb.toFixed(0)}%</div>
                <div className="font-mono text-[10px] text-zinc-500">{fmtOdds(p.winnerOdds)}</div>
              </div>
              {inParlay ? <Check size={15} className="text-sky-400"/> : <Plus size={15} className="text-zinc-600"/>}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-zinc-500 mt-5 leading-relaxed max-w-3xl">
        <strong className="text-zinc-300">Note:</strong> Hit probability multiplies independent model probabilities — real fight outcomes
        are correlated and the heuristic is uncalibrated, so true parlay odds differ. For analysis and entertainment, not betting advice.
      </p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// BETTING ANALYTICS
// ═══════════════════════════════════════════════════════════════════════

const Analytics = ({ openFight }) => {
  const allFights = useMemo(()=>getAllFights(),[]);
  const edges = [...allFights].sort((a,b)=>b.edge-a.edge);
  const upsets = allFights.filter(x=>x.isUnderdog && x.wProb>40);
  const lineData = allFights.slice(0,7).map(p=>({
    name:p.winner.name.split(' ').slice(-1)[0],
    market:Math.round(p.impl), model:Math.round(p.wProb),
  }));

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <PageHead icon={Gauge} tag="Betting intelligence" title="BETTING ANALYTICS"
        desc="Edge finder, model-vs-market comparison, and upset alerts across all upcoming cards."/>
      <div className="grid lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 bg-[#0e0e12] border border-zinc-900 p-5">
          <h3 className="font-display text-lg tracking-tight text-zinc-100 mb-3 flex items-center gap-2"><Crosshair size={14} className="text-emerald-500"/> EDGE FINDER</h3>
          <div className="grid grid-cols-[1fr_70px_70px_70px] gap-x-3 pb-2 border-b border-zinc-900 text-[10px] uppercase tracking-[0.13em] text-zinc-500">
            <span>Pick</span><span className="text-right">Market</span><span className="text-right">Model</span><span className="text-right">Edge</span>
          </div>
          {edges.map((p,i)=>(
            <button key={i} onClick={()=>openFight(p.event,p.bout)}
              className="w-full grid grid-cols-[1fr_70px_70px_70px] gap-x-3 items-center py-2.5 border-b border-zinc-900/50 hover:bg-zinc-900/30 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Avatar fighter={p.winner} size={28}/>
                <div className="min-w-0">
                  <div className="text-zinc-200 truncate">{p.winner.name}</div>
                  <div className="text-[10px] text-zinc-500 truncate">{p.event.subtitle}</div>
                </div>
              </div>
              <span className="font-mono text-zinc-400 text-right">{p.impl.toFixed(0)}%</span>
              <span className="font-mono text-red-300 text-right">{p.wProb.toFixed(0)}%</span>
              <span className={`font-mono text-right font-bold ${p.edge>3?'text-emerald-400':p.edge<-3?'text-red-400':'text-zinc-500'}`}>{p.edge>0?'+':''}{p.edge.toFixed(1)}</span>
            </button>
          ))}
        </section>
        <div className="space-y-4">
          <section className="bg-[#0e0e12] border border-zinc-900">
            <div className="px-5 py-3 border-b border-zinc-900 flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500"/>
              <h3 className="font-display text-sm tracking-[0.08em] text-zinc-100">UPSET ALERTS</h3>
            </div>
            {upsets.length===0 && <div className="px-5 py-4 text-[12px] text-zinc-500">No live underdog the model rates above 40%.</div>}
            <div className="divide-y divide-zinc-900">
              {upsets.map((p,i)=>(
                <button key={i} onClick={()=>openFight(p.event,p.bout)} className="w-full text-left px-5 py-3 hover:bg-[#131318] flex items-center gap-3">
                  <Avatar fighter={p.winner} size={32}/>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-zinc-200 truncate">{p.winner.name}</div>
                    <div className="text-[10px] text-zinc-500">{p.event.subtitle} · dog at {fmtOdds(p.winnerOdds)}</div>
                  </div>
                  <div className="font-mono text-sm text-amber-400 font-bold">{p.wProb.toFixed(0)}%</div>
                </button>
              ))}
            </div>
          </section>
          <section className="bg-[#0e0e12] border border-zinc-900 p-5">
            <h3 className="font-display text-sm tracking-[0.08em] text-zinc-100 mb-3">CARD SUMMARY</h3>
            <div className="space-y-2.5 text-xs">
              {[
                ['Fights with +3pp edge', allFights.filter(x=>x.edge>3).length],
                ['Fights with −3pp edge', allFights.filter(x=>x.edge<-3).length],
                ['Underdog model picks', allFights.filter(x=>x.isUnderdog).length],
                ['Projected finishes', allFights.filter(x=>x.pred.primary!=='Decision').length],
                ['Elite-tier picks (75%+)', allFights.filter(x=>x.wProb>=75).length],
              ].map(([l,v])=>(
                <div key={l} className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-zinc-400">{l}</span>
                  <span className="font-mono text-zinc-200 tabular-nums">{v}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <section className="bg-[#0e0e12] border border-zinc-900 p-5 mt-4">
        <h3 className="font-display text-lg tracking-tight text-zinc-100 mb-1 flex items-center gap-2"><BarChart3 size={14} className="text-zinc-500"/> MODEL vs MARKET</h3>
        <p className="text-[11px] text-zinc-500 mb-3">Where the heuristic disagrees with sportsbook implied probability — main events</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={lineData} barGap={2}>
            <CartesianGrid stroke="#1f1f26" vertical={false}/>
            <XAxis dataKey="name" stroke="#52525b" fontSize={10} tick={{fontFamily:'monospace'}}/>
            <YAxis stroke="#52525b" fontSize={10} unit="%" tick={{fontFamily:'monospace'}}/>
            <Tooltip contentStyle={{background:'#0a0a0c',border:'1px solid #27272a',fontSize:11,fontFamily:'monospace'}}/>
            <Bar dataKey="market" fill="#52525b" name="Market implied" radius={[2,2,0,0]}/>
            <Bar dataKey="model" fill="#dc2626" name="Model" radius={[2,2,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 text-[10px] text-zinc-500 mt-2">
          <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-zinc-600"/> Market implied</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-red-600"/> Heuristic model</span>
        </div>
      </section>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// HISTORICAL RESULTS + ACCURACY
// ═══════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════
// HISTORICAL RESULTS — backtest browser
// ═══════════════════════════════════════════════════════════════════════

const ResultBadge = ({ ok, label }) => (
  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[9px] uppercase tracking-[0.1em] font-semibold ${
    ok ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50'
       : 'bg-red-950/50 text-red-400 border border-red-900/50'}`}>
    {ok ? <Check size={9}/> : <X size={9}/>}{label}
  </span>
);

const GradedFightRow = ({ g }) => {
  const { a, b, pred, modelPick, conf, res, isDraw, pickCorrect, methodCorrect, roundCorrect, winner, roi, wasUpset } = g;
  return (
    <div className={`p-3 border ${isDraw?'border-zinc-800 bg-zinc-900/20':pickCorrect?'border-emerald-900/40 bg-emerald-950/10':'border-red-900/40 bg-red-950/10'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">{a.division==='WSW'||a.division==='WBW'||a.division==='WFLW'?"Women's ":''}{g.bout.division}</span>
        <div className="flex items-center gap-1.5">
          {wasUpset && <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-950/50 text-amber-400 border border-amber-900/50 rounded-sm text-[9px] uppercase tracking-[0.1em] font-semibold"><AlertTriangle size={9}/>Upset</span>}
          {isDraw
            ? <Pill tone="neutral">Draw · Push</Pill>
            : <Pill tone={pickCorrect?'green':'red'}>{pickCorrect?'Hit':'Miss'}</Pill>}
        </div>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 justify-end min-w-0">
          <div className="text-right min-w-0">
            <div className={`text-[13px] truncate ${winner&&winner.id===a.id?'text-zinc-100 font-semibold':'text-zinc-400'}`}>{a.name}</div>
            <div className="font-mono text-[9px] text-zinc-600">{a.country}</div>
          </div>
          <Avatar fighter={a} size={36}/>
        </div>
        <span className="font-display text-zinc-600 text-xs">VS</span>
        <div className="flex items-center gap-2 min-w-0">
          <Avatar fighter={b} size={36} mirror/>
          <div className="min-w-0">
            <div className={`text-[13px] truncate ${winner&&winner.id===b.id?'text-zinc-100 font-semibold':'text-zinc-400'}`}>{b.name}</div>
            <div className="font-mono text-[9px] text-zinc-600">{b.country}</div>
          </div>
        </div>
      </div>
      <div className="mt-2.5 pt-2.5 border-t border-zinc-900 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
        <div>
          <div className="text-[9px] uppercase tracking-[0.1em] text-zinc-600">Model picked</div>
          <div className="text-zinc-200 flex items-center gap-1">
            {modelPick.name.split(' ').slice(-1)[0]} <span className="font-mono text-zinc-500">{conf}%</span>
          </div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-[0.1em] text-zinc-600">Actual result</div>
          <div className="text-zinc-200">{isDraw?'Majority Draw':`${winner.name.split(' ').slice(-1)[0]} · ${res.method}${res.method==='Decision'?'':` R${res.round}`}`}</div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-[0.1em] text-zinc-600">Method / Round</div>
          <div className="flex items-center gap-1">
            <ResultBadge ok={methodCorrect} label={pred.primary}/>
            {pred.primary!=='Decision' && <ResultBadge ok={roundCorrect} label={`R${res.round}`}/>}
          </div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-[0.1em] text-zinc-600">Sim. ROI</div>
          <div className={`font-mono ${roi>0?'text-emerald-400':roi<0?'text-red-400':'text-zinc-500'}`}>{roi>0?'+':''}{roi}u</div>
        </div>
      </div>
    </div>
  );
};

const Results = () => {
  const bt = useMemo(()=>runBacktest(),[]);
  const [openEv, setOpenEv] = useState(PAST_EVENTS[0].id);
  const graded = bt.filter(g=>!g.isDraw);
  const hits = graded.filter(g=>g.pickCorrect).length;
  const accuracy = (hits/graded.length)*100;
  const totalRoi = bt.reduce((s,g)=>s+g.roi,0);

  const perEvent = PAST_EVENTS.map(ev=>{
    const fs = bt.filter(g=>g.event.id===ev.id);
    const g2 = fs.filter(g=>!g.isDraw);
    const correct = g2.filter(g=>g.pickCorrect).length;
    const roi = fs.reduce((s,g)=>s+g.roi,0);
    const sorted = [...g2].sort((a,b)=>b.conf-a.conf);
    const mostConfident = sorted[0];
    const correctOnes = g2.filter(g=>g.pickCorrect);
    const bestPrediction = [...correctOnes].sort((a,b)=>
      (b.methodCorrect+b.roundCorrect)-(a.methodCorrect+a.roundCorrect) || b.conf-a.conf)[0];
    const worstMiss = [...g2.filter(g=>!g.pickCorrect)].sort((a,b)=>b.conf-a.conf)[0];
    const biggestUpset = [...g2].filter(g=>g.wasUpset).sort((a,b)=>a.winnerProb-b.winnerProb)[0];
    return { ev, fs, correct, incorrect:g2.length-correct, total:g2.length, acc:correct/g2.length*100,
      roi, mostConfident, bestPrediction, worstMiss, biggestUpset };
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <PageHead icon={History} tag={`${bt.length} fights graded · ${PAST_EVENTS.length} events`}
        title="HISTORICAL RESULTS"
        desc="The live prediction engine applied to recent completed UFC events, graded against real outcomes."/>

      <div className="bg-amber-950/20 border border-amber-800/50 rounded-sm p-4 mb-6 flex gap-3">
        <Info size={16} className="text-amber-500 mt-0.5 shrink-0"/>
        <div className="text-[12px] text-zinc-300 leading-relaxed">
          <span className="text-amber-300 font-semibold">How to read this.</span> Every fight below has a known real outcome.
          The same deterministic heuristic used elsewhere on the site is run against each matchup and graded ✓/✗.
          Two honest caveats: the engine reads <em>current</em> fighter stats, not point-in-time pre-fight data, and
          these predictions were <em>not</em> logged before the events — so this is an illustrative backtest, not a
          verified pre-registered track record. Sample size ({graded.length} graded fights) is far too small to be
          statistically meaningful. "ROI" is a flat 1-unit stake simulation, not betting advice.
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900 mb-6 rounded-sm overflow-hidden">
        {[
          {l:'Backtest Accuracy',v:`${accuracy.toFixed(0)}%`,s:`${hits}/${graded.length} picks correct`,c:accuracy>=50?'text-emerald-400':'text-red-400'},
          {l:'Simulated ROI',v:`${totalRoi>=0?'+':''}${(totalRoi/bt.length*100).toFixed(1)}%`,s:'per fight, flat stake',c:totalRoi>=0?'text-emerald-400':'text-red-400'},
          {l:'Events Graded',v:PAST_EVENTS.length,s:'Real completed cards',c:'text-zinc-100'},
          {l:'Sample Size',v:'Small',s:'Not significant',c:'text-amber-400'},
        ].map((k,i)=>(
          <div key={i} className="bg-[#0e0e12] px-5 py-4">
            <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{k.l}</div>
            <div className={`mt-1.5 font-mono text-2xl ${k.c} tabular-nums font-bold`}>{k.v}</div>
            <div className="text-[10px] text-zinc-500 mt-1">{k.s}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {perEvent.map(pe=>{
          const isOpen = openEv===pe.ev.id;
          return (
            <div key={pe.ev.id} className="bg-[#0e0e12] border border-zinc-900 overflow-hidden">
              <button onClick={()=>setOpenEv(isOpen?null:pe.ev.id)}
                className="w-full text-left hover:bg-[#131318] transition-colors">
                <div className="relative h-10" style={{background:`linear-gradient(90deg, ${pe.ev.banner}, transparent 70%)`}}>
                  <div className="absolute inset-0 flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-base text-zinc-100">{pe.ev.name}</span>
                      <span className="text-[11px] text-zinc-400 hidden sm:inline">{pe.ev.subtitle}</span>
                    </div>
                    <ChevronRight size={16} className={`text-zinc-400 transition-transform ${isOpen?'rotate-90':''}`}/>
                  </div>
                </div>
                <div className="px-4 py-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-[11px]">
                  <div><div className="text-[9px] uppercase tracking-[0.1em] text-zinc-600">Record</div>
                    <div className="font-mono"><span className="text-emerald-400">{pe.correct}W</span> <span className="text-red-400">{pe.incorrect}L</span></div></div>
                  <div><div className="text-[9px] uppercase tracking-[0.1em] text-zinc-600">Accuracy</div>
                    <div className={`font-mono ${pe.acc>=50?'text-emerald-400':'text-red-400'}`}>{pe.acc.toFixed(0)}%</div></div>
                  <div><div className="text-[9px] uppercase tracking-[0.1em] text-zinc-600">Sim. ROI</div>
                    <div className={`font-mono ${pe.roi>=0?'text-emerald-400':'text-red-400'}`}>{pe.roi>=0?'+':''}{pe.roi.toFixed(2)}u</div></div>
                  <div><div className="text-[9px] uppercase tracking-[0.1em] text-zinc-600">Top pick</div>
                    <div className="text-zinc-300 truncate">{pe.mostConfident?`${pe.mostConfident.modelPick.name.split(' ').slice(-1)[0]} ${pe.mostConfident.conf}%`:'—'}</div></div>
                  <div><div className="text-[9px] uppercase tracking-[0.1em] text-zinc-600">Best call</div>
                    <div className="text-emerald-400 truncate">{pe.bestPrediction?pe.bestPrediction.winner.name.split(' ').slice(-1)[0]:'—'}</div></div>
                  <div><div className="text-[9px] uppercase tracking-[0.1em] text-zinc-600">Worst miss</div>
                    <div className="text-red-400 truncate">{pe.worstMiss?`${pe.worstMiss.modelPick.name.split(' ').slice(-1)[0]} ${pe.worstMiss.conf}%`:'—'}</div></div>
                </div>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 space-y-2 border-t border-zinc-900 pt-3">
                  {pe.biggestUpset && (
                    <div className="text-[11px] text-amber-300 flex items-center gap-1.5 mb-1">
                      <AlertTriangle size={12}/> Biggest upset: {pe.biggestUpset.winner.name} won as a {pe.biggestUpset.winnerProb}% model underdog.
                    </div>
                  )}
                  {pe.fs.map((g,i)=><GradedFightRow key={i} g={g}/>)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// BET TRACKER — betting performance dashboard (parameterized by confidence)
// ═══════════════════════════════════════════════════════════════════════

const BetTracker = ({ minConf=0, label, sublabel, showCompare=false }) => {
  const bt = useMemo(()=>runBacktest(),[]);
  const [wc, setWc] = useState('ALL');
  const [side, setSide] = useState('ALL');

  const wcOptions = useMemo(()=>['ALL', ...Array.from(new Set(bt.map(g=>g.a.division)))],[bt]);

  const pool = bt.filter(g=>{
    if (g.isDraw || g.conf < minConf) return false;
    if (wc!=='ALL' && g.a.division!==wc) return false;
    if (side==='fav' && g.isUnderdog) return false;
    if (side==='dog' && !g.isUnderdog) return false;
    return true;
  });
  const chrono = [...pool].reverse();
  const N = pool.length;
  const wins = pool.filter(g=>g.pickCorrect).length;
  const losses = N - wins;
  const winPct = N ? wins/N*100 : 0;
  const totalRoi = pool.reduce((s,g)=>s+g.roi,0);
  const avgDec = N ? pool.reduce((s,g)=>s+americanToDecimal(g.pickOdds),0)/N : 0;
  const avgConf = N ? pool.reduce((s,g)=>s+g.conf,0)/N : 0;
  const ev = N ? pool.reduce((s,g)=>{ const p=g.conf/100, d=americanToDecimal(g.pickOdds); return s+(p*(d-1)-(1-p)); },0)/N : 0;

  let bank=100;
  const series = chrono.map((g,i)=>{ bank+=g.roi; return { i:i+1, bank:+bank.toFixed(2) }; });
  let cw=0;
  const rolling = chrono.map((g,i)=>{ cw+=g.pickCorrect?1:0; return { i:i+1, acc:+((cw/(i+1))*100).toFixed(1) }; });

  const bands = [[Math.max(50,minConf),60],[60,70],[70,80],[80,101]].filter(b=>b[1]>minConf&&b[0]<b[1]);
  const calib = bands.map(([lo,hi])=>{
    const inB = pool.filter(g=>g.conf>=lo&&g.conf<hi);
    return { band:`${lo}-${hi===101?'100':hi}%`, n:inB.length,
      actual:inB.length?Math.round(inB.filter(g=>g.pickCorrect).length/inB.length*100):0,
      stated:inB.length?Math.round(inB.reduce((s,g)=>s+g.conf,0)/inB.length):0 };
  });

  const evMap={};
  pool.forEach(g=>{ const k=g.event.name+' '+g.event.subtitle;
    (evMap[k]=evMap[k]||{ name:g.event.name.replace('UFC ',''), roi:0, n:0 }); evMap[k].roi+=g.roi; evMap[k].n++; });
  const evRoi = Object.values(evMap).reverse().map(e=>({ ...e, roi:+e.roi.toFixed(2) }));

  const cmp = useMemo(()=>{
    const mk = mc => { const p=bt.filter(g=>!g.isDraw&&g.conf>=mc); const w=p.filter(g=>g.pickCorrect).length;
      return { n:p.length, win:p.length?w/p.length*100:0, roi:p.reduce((s,g)=>s+g.roi,0) }; };
    return { all:mk(0), high:mk(60) };
  },[bt]);

  const tip = { background:'#0a0a0c', border:'1px solid #27272a', fontSize:11, fontFamily:'monospace' };
  const Stat = ({ l, v, s, c }) => (
    <div className="bg-[#0e0e12] px-4 py-3.5">
      <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">{l}</div>
      <div className={`mt-1.5 font-mono text-xl sm:text-2xl ${c} tabular-nums font-bold leading-none`}>{v}</div>
      <div className="text-[10px] text-zinc-500 mt-1">{s}</div>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <PageHead icon={BarChart3} tag="Simulated betting tracker" title={label} desc={sublabel}/>

      <div className="bg-amber-950/20 border border-amber-800/50 rounded-sm p-4 mb-6 flex gap-3">
        <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0"/>
        <div className="text-[12px] text-zinc-300 leading-relaxed">
          <span className="text-amber-300 font-semibold">Honest framing.</span> This applies the deterministic prediction
          heuristic to completed fights and grades it — it uses current fighter stats (not point-in-time data) and the
          picks were not logged before the events. The {N}-fight sample is far too small to be statistically meaningful.
          "ROI", "bankroll" and "EV" are a flat 1-unit simulation for illustration — not a verified track record and not betting advice.
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Filter size={13} className="text-zinc-500"/>
        <select value={wc} onChange={e=>setWc(e.target.value)}
          className="px-3 py-1.5 bg-zinc-900/70 border border-zinc-800 rounded-sm text-[11px] text-zinc-200">
          {wcOptions.map(o=><option key={o} value={o}>{o==='ALL'?'All weight classes':o}</option>)}
        </select>
        {[['ALL','All picks'],['fav','Favorites'],['dog','Underdogs']].map(([v,l])=>(
          <button key={v} onClick={()=>setSide(v)}
            className={`px-2.5 py-1.5 text-[11px] border rounded-sm transition-colors ${
              side===v?'bg-red-600 border-red-500 text-white':'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}>
            {l}
          </button>
        ))}
        <span className="text-[11px] text-zinc-600 ml-auto">{N} bets in current view</span>
      </div>

      {N===0 ? (
        <div className="bg-[#0e0e12] border border-zinc-900 p-8 text-center text-[13px] text-zinc-500">
          No graded picks match these filters.
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900 mb-6 rounded-sm overflow-hidden">
            <Stat l="Bets Tracked" v={N} s="graded predictions" c="text-zinc-100"/>
            <Stat l="Record" v={`${wins}-${losses}`} s={`${winPct.toFixed(0)}% win rate`} c={winPct>=50?'text-emerald-400':'text-red-400'}/>
            <Stat l="Cumulative P/L" v={`${totalRoi>=0?'+':''}${totalRoi.toFixed(1)}u`} s="flat 1u stakes" c={totalRoi>=0?'text-emerald-400':'text-red-400'}/>
            <Stat l="ROI" v={`${totalRoi>=0?'+':''}${(totalRoi/N*100).toFixed(1)}%`} s="per bet" c={totalRoi>=0?'text-emerald-400':'text-red-400'}/>
            <Stat l="Bankroll" v={`${series[series.length-1].bank.toFixed(1)}u`} s="from 100u start" c={series[series.length-1].bank>=100?'text-emerald-400':'text-red-400'}/>
            <Stat l="Avg Odds" v={avgDec.toFixed(2)} s="decimal, picked side" c="text-sky-400"/>
            <Stat l="Avg Confidence" v={`${avgConf.toFixed(1)}%`} s="model conviction" c="text-purple-400"/>
            <Stat l="Expected Value" v={`${ev>=0?'+':''}${(ev*100).toFixed(1)}%`} s="model EV per bet" c={ev>=0?'text-emerald-400':'text-red-400'}/>
          </div>

          {showCompare && (
            <section className="bg-[#0e0e12] border border-zinc-900 p-5 mb-4">
              <h3 className="font-display text-base tracking-[0.08em] text-zinc-100 mb-3 flex items-center gap-2"><Crosshair size={14} className="text-red-500"/> HIGH CONFIDENCE vs ALL PICKS</h3>
              <div className="grid grid-cols-2 gap-3">
                {[['All predictions',cmp.all,'#3f3f46'],['60%+ confidence',cmp.high,'#dc2626']].map(([t,d,col])=>(
                  <div key={t} className="border border-zinc-800 p-3" style={{borderLeftColor:col,borderLeftWidth:3}}>
                    <div className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">{t}</div>
                    <div className="font-mono text-xl text-zinc-100 font-bold mt-1">{d.win.toFixed(0)}% <span className="text-[11px] text-zinc-500">win</span></div>
                    <div className={`font-mono text-[12px] ${d.roi>=0?'text-emerald-400':'text-red-400'}`}>{d.roi>=0?'+':''}{d.roi.toFixed(1)}u · {d.n} bets</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-[12px] text-zinc-400 leading-relaxed">
                {cmp.high.n===0 ? 'No 60%+ picks in the database yet.'
                  : cmp.high.win>cmp.all.win
                    ? `On this small sample, 60%+ picks hit at ${cmp.high.win.toFixed(0)}% versus ${cmp.all.win.toFixed(0)}% overall — higher confidence has tracked with better accuracy, but ${cmp.high.n} bets is far from conclusive.`
                    : `On this small sample, 60%+ picks (${cmp.high.win.toFixed(0)}%) have not outperformed all picks (${cmp.all.win.toFixed(0)}%). With only ${cmp.high.n} high-confidence bets, that is noise, not a signal.`}
              </div>
            </section>
          )}

          <div className="grid lg:grid-cols-2 gap-4">
            <section className="bg-[#0e0e12] border border-zinc-900 p-5">
              <h3 className="font-display text-lg tracking-tight text-zinc-100 mb-1 flex items-center gap-2"><DollarSign size={14} className="text-emerald-500"/> BANKROLL PROGRESSION</h3>
              <p className="text-[11px] text-zinc-500 mb-3">Simulated bankroll, 100u start, flat 1u stakes (oldest → newest)</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={series}>
                  <CartesianGrid stroke="#1f1f26" vertical={false}/>
                  <XAxis dataKey="i" stroke="#52525b" fontSize={10} tick={{fontFamily:'monospace'}}/>
                  <YAxis stroke="#52525b" fontSize={10} unit="u" domain={['dataMin-4','dataMax+4']} tick={{fontFamily:'monospace'}}/>
                  <Tooltip contentStyle={tip}/>
                  <ReferenceLine y={100} stroke="#3f3f46" strokeDasharray="4 4"/>
                  <Area type="monotone" dataKey="bank" stroke="#22c55e" strokeWidth={2} fill="url(#bankG)"/>
                  <defs><linearGradient id="bankG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35}/>
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient></defs>
                </AreaChart>
              </ResponsiveContainer>
            </section>

            <section className="bg-[#0e0e12] border border-zinc-900 p-5">
              <h3 className="font-display text-lg tracking-tight text-zinc-100 mb-1 flex items-center gap-2"><Activity size={14} className="text-sky-500"/> ROLLING WIN RATE</h3>
              <p className="text-[11px] text-zinc-500 mb-3">Cumulative pick accuracy as bets accumulate</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={rolling}>
                  <CartesianGrid stroke="#1f1f26" vertical={false}/>
                  <XAxis dataKey="i" stroke="#52525b" fontSize={10} tick={{fontFamily:'monospace'}}/>
                  <YAxis stroke="#52525b" fontSize={10} unit="%" domain={[0,100]} tick={{fontFamily:'monospace'}}/>
                  <Tooltip contentStyle={tip}/>
                  <ReferenceLine y={50} stroke="#3f3f46" strokeDasharray="4 4"/>
                  <Line type="monotone" dataKey="acc" stroke="#0ea5e9" strokeWidth={2} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </section>

            <section className="bg-[#0e0e12] border border-zinc-900 p-5">
              <h3 className="font-display text-lg tracking-tight text-zinc-100 mb-1 flex items-center gap-2"><Target size={14} className="text-zinc-500"/> CONFIDENCE CALIBRATION</h3>
              <p className="text-[11px] text-zinc-500 mb-3">Stated confidence vs actual hit rate per band</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={calib}>
                  <CartesianGrid stroke="#1f1f26" vertical={false}/>
                  <XAxis dataKey="band" stroke="#52525b" fontSize={10} tick={{fontFamily:'monospace'}}/>
                  <YAxis stroke="#52525b" fontSize={10} unit="%" domain={[0,100]} tick={{fontFamily:'monospace'}}/>
                  <Tooltip contentStyle={tip}/>
                  <Legend wrapperStyle={{fontSize:10,fontFamily:'monospace'}}/>
                  <Bar dataKey="stated" name="Stated" fill="#3f3f46" radius={[2,2,0,0]}/>
                  <Bar dataKey="actual" name="Actual" fill="#dc2626" radius={[2,2,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="bg-[#0e0e12] border border-zinc-900 p-5">
              <h3 className="font-display text-lg tracking-tight text-zinc-100 mb-1 flex items-center gap-2"><BarChart3 size={14} className="text-zinc-500"/> EVENT-BY-EVENT ROI</h3>
              <p className="text-[11px] text-zinc-500 mb-3">Simulated unit profit/loss per event</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={evRoi}>
                  <CartesianGrid stroke="#1f1f26" vertical={false}/>
                  <XAxis dataKey="name" stroke="#52525b" fontSize={9} tick={{fontFamily:'monospace'}} interval={0} angle={-20} textAnchor="end" height={50}/>
                  <YAxis stroke="#52525b" fontSize={10} unit="u" tick={{fontFamily:'monospace'}}/>
                  <Tooltip contentStyle={tip}/>
                  <ReferenceLine y={0} stroke="#3f3f46"/>
                  <Bar dataKey="roi" name="ROI (u)" radius={[2,2,0,0]}>
                    {evRoi.map((e,i)=><Cell key={i} fill={e.roi>=0?'#22c55e':'#dc2626'}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

// finds a fighter's next scheduled bout across all events
function findUpcomingFight(fighterId) {
  for (const ev of EVENTS) {
    const bouts = [...ev.card, ...((ev.prelimCard)||[])];
    for (const bout of bouts) {
      if (bout.f1===fighterId || bout.f2===fighterId) return { event:ev, bout };
    }
  }
  return null;
}

// a fighter's completed fights from the database, newest first, with Elo deltas
function findFighterHistory(fighterId) {
  const fights = [];
  [...PAST_EVENTS].reverse().forEach(ev => {       // oldest -> newest
    ev.card.forEach(bout => {
      if (bout.f1===fighterId || bout.f2===fighterId) {
        const res = bout.result, isDraw = res.winner==='draw';
        fights.push({ ev, bout, res, isDraw,
          won: !isDraw && res.winner===fighterId,
          oppId: bout.f1===fighterId ? bout.f2 : bout.f1 });
      }
    });
  });
  const hist = eloHistOf(fighterId).slice(1);      // skip the career seed
  fights.filter(x=>!x.isDraw).forEach((ft,i)=>{ ft.eloDelta = hist[i] ? hist[i].delta : null; });
  return fights.reverse();                          // newest first for display
}

const Fighters = ({ openFighter }) => {
  const [q, setQ] = useState('');
  const [div, setDiv] = useState('All');
  const [sort, setSort] = useState('rank');
  const divisions = ['All', ...Array.from(new Set(Object.values(FIGHTERS).map(fr=>fr.division)))];
  let list = Object.values(FIGHTERS).filter(fr=>{
    const matchQ = fr.name.toLowerCase().includes(q.toLowerCase()) || (fr.style||'').toLowerCase().includes(q.toLowerCase());
    const matchD = div==='All' || fr.division===div;
    return matchQ && matchD;
  });
  list = [...list].sort((a,b)=>{
    if (sort==='rank') {
      const ra = a.rank==='C'?0:(a.rank||999), rb = b.rank==='C'?0:(b.rank||999);
      return ra-rb;
    }
    if (sort==='streak') {
      const sv = s=>(s&&s.startsWith('W')?parseInt(s.slice(1))||0:-(parseInt((s||'').slice(1))||0));
      return sv(b.streak)-sv(a.streak);
    }
    if (sort==='age') return a.age-b.age;
    if (sort==='name') return a.name.localeCompare(b.name);
    return 0;
  });
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <PageHead icon={Users} tag={`${Object.keys(FIGHTERS).length} fighters · 7 upcoming cards`} title="FIGHTER DATABASE"
        desc="Every fighter from the upcoming cards. Search, filter and click any fighter for a full profile with stats, analytics and their next bout."/>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900/70 border border-zinc-800 rounded-sm w-full sm:w-64">
          <Search size={14} className="text-zinc-500"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name or style…"
            className="bg-transparent outline-none text-[13px] text-zinc-200 placeholder-zinc-600 w-full"/>
        </div>
        <select value={div} onChange={e=>setDiv(e.target.value)}
          className="px-3 py-2 bg-zinc-900/70 border border-zinc-800 rounded-sm text-[12px] text-zinc-200">
          {divisions.map(d=><option key={d} value={d}>{d==='All'?'All divisions':d}</option>)}
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value)}
          className="px-3 py-2 bg-zinc-900/70 border border-zinc-800 rounded-sm text-[12px] text-zinc-200">
          <option value="rank">Sort: Ranking</option>
          <option value="streak">Sort: Win streak</option>
          <option value="age">Sort: Age</option>
          <option value="name">Sort: Name</option>
        </select>
        <span className="text-[11px] text-zinc-600 font-mono ml-auto">{list.length} shown</span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {list.map(fr=>{
          const up = findUpcomingFight(fr.id);
          return (
            <button key={fr.id} onClick={()=>openFighter(fr)}
              className="group text-left bg-[#0e0e12] border border-zinc-900 hover:border-zinc-600 transition-colors p-5">
              <div className="flex items-start justify-between mb-3">
                <Avatar fighter={fr} size={60}/>
                <div className="text-right">
                  <div className="font-mono text-[10px] text-zinc-500">{fr.rank==='C'?'CHAMP':fr.rank?`#${fr.rank}`:'NR'} {fr.division}</div>
                  {fr.p4p && <div className="font-mono text-[10px] text-amber-500">P4P #{fr.p4p}</div>}
                </div>
              </div>
              <h3 className="font-display text-lg text-zinc-100 tracking-tight leading-none">{fr.name.toUpperCase()}</h3>
              <div className="text-[11px] text-zinc-500 italic mt-1 truncate">"{fr.nick}" · {fr.country}</div>
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-zinc-900 text-[11px]">
                <div><div className="text-[9px] uppercase tracking-[0.1em] text-zinc-600">Record</div><div className="font-mono text-zinc-300">{fr.record}</div></div>
                <div><div className="text-[9px] uppercase tracking-[0.1em] text-zinc-600">Streak</div><div className={`font-mono ${fr.streak.startsWith('W')?'text-emerald-400':'text-red-400'}`}>{fr.streak}</div></div>
                <div><div className="text-[9px] uppercase tracking-[0.1em] text-zinc-600">SLpM</div><div className="font-mono text-zinc-300">{fr.slpm??'—'}</div></div>
              </div>
              <div className="mt-2.5 pt-2.5 border-t border-zinc-900 flex items-center justify-between text-[10px]">
                <span className="text-zinc-500">{fr.style}</span>
                {up && <span className="text-red-400 font-mono flex items-center gap-1">Next fight <ArrowRight size={10}/></span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// FIGHTER PROFILE
// ═══════════════════════════════════════════════════════════════════════

const FighterProfile = ({ fighter, setView, openFight }) => {
  if (!fighter) return null;
  const fr = fighter;
  const up = findUpcomingFight(fr.id);
  // division averages for the radar comparison
  const peers = Object.values(FIGHTERS).filter(x=>x.division===fr.division);
  const avg = k => peers.reduce((s,x)=>s+(x[k]||0),0)/peers.length;
  const radar = [
    { stat:'SLpM', me:(fr.slpm||0)*10, div:avg('slpm')*10 },
    { stat:'Str Acc', me:fr.strAcc||0, div:avg('strAcc') },
    { stat:'TD/15m', me:(fr.tdAvg||0)*15, div:avg('tdAvg')*15 },
    { stat:'TD Acc', me:fr.tdAcc||0, div:avg('tdAcc') },
    { stat:'Subs', me:(fr.subAvg||0)*30, div:avg('subAvg')*30 },
  ];
  const winPct = Math.round(fr.wins/(fr.wins+fr.losses)*100);
  // modeled finish-tendency profile (derived from style stats — not official method splits)
  const koLean = Math.min(95, Math.round((fr.slpm||2)*9 + (fr.strAcc||44)*0.3));
  const subLean = Math.min(95, Math.round((fr.subAvg||0)*28 + (fr.tdAvg||0)*6));
  const decLean = Math.max(5, 100-koLean*0.55-subLean*0.55);
  const tot = koLean+subLean+decLean;
  const methodSplit = [
    { label:'KO/TKO tendency', v:Math.round(koLean/tot*100), c:'#dc2626' },
    { label:'Submission tendency', v:Math.round(subLean/tot*100), c:'#a855f7' },
    { label:'Decision tendency', v:Math.round(decLean/tot*100), c:'#0ea5e9' },
  ];

  let pred=null, opp=null;
  if (up) { opp = f(up.bout.f1===fr.id?up.bout.f2:up.bout.f1); pred = predictFight(f(up.bout.f1),f(up.bout.f2),scheduledRounds(up.bout)); }

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6">
      <button onClick={()=>setView('fighters')} className="text-[11px] uppercase tracking-[0.14em] text-zinc-500 hover:text-zinc-200 flex items-center gap-1 mb-4">
        <ArrowRight size={12} className="rotate-180"/> Fighter database
      </button>

      {/* PROFILE HERO — clean solid banner */}
      <div className="relative border border-zinc-800/80 overflow-hidden bg-[#0c0c10]">
        <div className="absolute inset-0" style={{
          background:`radial-gradient(100% 90% at 85% 0%, ${fr.color}, transparent 60%)`, opacity:0.5 }}/>
        <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background:fr.color }}/>
        <div className="relative p-5 sm:p-7 flex flex-col sm:flex-row gap-5 sm:gap-7 items-center sm:items-start">
          <Avatar fighter={fr} size={150}/>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-2">
              <Pill tone={fr.rank==='C'?'amber':'neutral'}>{fr.rank==='C'?'CHAMPION':fr.rank?`#${fr.rank} ${fr.division}`:fr.division}</Pill>
              {fr.p4p && <Pill tone="amber" icon={Star}>P4P #{fr.p4p}</Pill>}
              <Pill icon={MapPin}>{fr.country}</Pill>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl text-zinc-100 tracking-tight leading-none">{fr.name.toUpperCase()}</h1>
            <div className="text-sm text-zinc-400 italic mt-1">"{fr.nick}" · {fr.style}</div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4 pt-4 border-t border-zinc-800">
              {[
                ['Record',fr.record],['Streak',fr.streak],['Age',fr.age],
                ['Height',fr.height],['Reach',`${fr.reach}"`],['Stance',fr.stance],
              ].map(([l,v])=>(
                <div key={l}><div className="text-[9px] uppercase tracking-[0.12em] text-zinc-600">{l}</div>
                  <div className="font-mono text-sm text-zinc-200">{v}</div></div>
              ))}
            </div>
            <div className="text-[11px] text-zinc-500 mt-3">Team: {fr.camp} · Last: {fr.last}</div>
          </div>
        </div>
      </div>

      {/* UPCOMING FIGHT */}
      {up && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={14} className="text-red-500"/>
            <h2 className="font-display text-base tracking-[0.08em] text-zinc-100">UPCOMING FIGHT</h2>
          </div>
          <button onClick={()=>openFight(up.event,up.bout)}
            className="group w-full text-left bg-gradient-to-br from-red-950/25 via-[#0e0e12] to-[#0e0e12] border border-red-900/50 hover:border-red-700 transition-colors p-4">
            <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-center">
              <div className="flex items-center gap-3">
                <Avatar fighter={fr} size={52}/>
                <span className="font-display text-zinc-600 text-lg">VS</span>
                <Avatar fighter={opp} size={52} mirror/>
                <div className="ml-1 min-w-0">
                  <div className="font-display text-base text-zinc-100 tracking-tight">{fr.name.split(' ').slice(-1)[0]} vs {opp.name.split(' ').slice(-1)[0]}</div>
                  <div className="text-[11px] text-zinc-500">{up.event.subtitle} · {up.event.date} · {up.bout.division}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[9px] uppercase tracking-[0.12em] text-zinc-600">AI pick</div>
                  <div className="text-sm text-zinc-200">{(pred.aProb>50?f(up.bout.f1):f(up.bout.f2)).name.split(' ').slice(-1)[0]}
                    {' '}<span className="font-mono text-red-400">{Math.max(pred.aProb,pred.bProb)}%</span></div>
                </div>
                <ArrowRight size={16} className="text-zinc-600 group-hover:text-red-400 transition-colors"/>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* UFC ELO */}
      <div className="mt-4 bg-[#0e0e12] border border-zinc-900 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg tracking-tight text-zinc-100 flex items-center gap-2"><Gauge size={14} className="text-amber-500"/> UFC ELO RATING</h3>
          <Pill tone="amber">Model-derived</Pill>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            ['Current Elo', eloOf(fr.id), 'text-amber-400'],
            ['Overall rank', `#${eloRankOverall(fr.id)}`, 'text-zinc-100'],
            [`${fr.division} Elo rank`, `#${eloRankInDivision(fr.id)}`, 'text-zinc-100'],
            ['Peak Elo', eloPeakOf(fr.id), 'text-sky-400'],
          ].map(([l,v,c])=>(
            <div key={l} className="bg-zinc-900/40 border border-zinc-800 p-3">
              <div className="text-[9px] uppercase tracking-[0.12em] text-zinc-600">{l}</div>
              <div className={`font-mono text-xl ${c} tabular-nums font-bold mt-1`}>{v}</div>
            </div>
          ))}
        </div>
        {eloHistOf(fr.id).length>1 ? (
          <div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 mb-2">Elo trajectory — seed through last result</div>
            <ResponsiveContainer width="100%" height={170}>
              <LineChart data={eloHistOf(fr.id).map((p,i)=>({...p, x:i}))}>
                <CartesianGrid stroke="#1f1f26" vertical={false}/>
                <XAxis dataKey="label" stroke="#52525b" fontSize={9} tick={{fontFamily:'monospace'}}/>
                <YAxis stroke="#52525b" fontSize={9} domain={['dataMin-25','dataMax+25']} tick={{fontFamily:'monospace'}}/>
                <Tooltip contentStyle={{background:'#0a0a0c',border:'1px solid #27272a',fontSize:11,fontFamily:'monospace'}}/>
                <Line type="monotone" dataKey="elo" stroke="#f59e0b" strokeWidth={2} dot={{r:3,fill:'#f59e0b'}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-[11px] text-zinc-500 bg-zinc-900/30 border border-zinc-800 p-3">
            No fights inside the tracked results window — rating shown is the career seed.
          </div>
        )}
        {up && (()=>{
          const proj = projectElo(fr.id, opp.id);
          return (
            <div className="mt-4 pt-4 border-t border-zinc-900">
              <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 mb-2">Projected Elo swing vs {opp.name.split(' ').slice(-1)[0]}</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-950/20 border border-emerald-900/40 p-3">
                  <div className="text-[10px] text-zinc-400">If {fr.name.split(' ').slice(-1)[0]} wins</div>
                  <div className="font-mono text-lg text-emerald-400 font-bold">+{proj.aWin} <span className="text-[11px] text-zinc-500">→ {eloOf(fr.id)+proj.aWin}</span></div>
                </div>
                <div className="bg-red-950/20 border border-red-900/40 p-3">
                  <div className="text-[10px] text-zinc-400">If {fr.name.split(' ').slice(-1)[0]} loses</div>
                  <div className="font-mono text-lg text-red-400 font-bold">{proj.aLoss} <span className="text-[11px] text-zinc-500">→ {eloOf(fr.id)+proj.aLoss}</span></div>
                </div>
              </div>
              <div className="text-[10px] text-zinc-600 mt-2">Elo win expectancy: {fr.name.split(' ').slice(-1)[0]} {proj.Ea}% · {opp.name.split(' ').slice(-1)[0]} {proj.Eb}%</div>
            </div>
          );
        })()}
      </div>

      {/* RECENT FIGHTS */}
      {(()=>{
        const hist = findFighterHistory(fr.id);
        return (
          <div className="mt-4 bg-[#0e0e12] border border-zinc-900 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg tracking-tight text-zinc-100 flex items-center gap-2"><History size={14} className="text-zinc-500"/> LAST 5 FIGHTS</h3>
              <span className="text-[10px] uppercase tracking-[0.1em] text-zinc-600">Tracked results</span>
            </div>
            {hist.length===0 ? (
              <div className="text-[12px] text-zinc-500 bg-zinc-900/30 border border-zinc-800 p-3 leading-relaxed">
                No completed fights for {fr.name.split(' ').slice(-1)[0]} inside the database's tracked results window.
                Most recent known result: <span className="text-zinc-300">{fr.last}</span>.
              </div>
            ) : (
              <div className="space-y-2">
                {hist.slice(0,5).map((h,i)=>{
                  const opp=f(h.oppId);
                  const res=h.res;
                  const tone = h.isDraw?'draw':h.won?'win':'loss';
                  return (
                    <button key={i} onClick={()=>openFight(h.ev,h.bout)}
                      className={`group w-full text-left flex items-center gap-3 p-3 border transition-colors ${
                        tone==='win'?'border-emerald-900/40 bg-emerald-950/10 hover:border-emerald-700'
                        :tone==='loss'?'border-red-900/40 bg-red-950/10 hover:border-red-700'
                        :'border-zinc-800 bg-zinc-900/20 hover:border-zinc-600'}`}>
                      <span className={`font-display text-lg w-7 text-center shrink-0 ${
                        tone==='win'?'text-emerald-400':tone==='loss'?'text-red-400':'text-zinc-500'}`}>
                        {tone==='win'?'W':tone==='loss'?'L':'D'}
                      </span>
                      <Avatar fighter={opp} size={38}/>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] text-zinc-100 truncate">vs {opp.name}</div>
                        <div className="text-[10px] text-zinc-500 truncate">{h.ev.name} · {h.ev.date}</div>
                      </div>
                      <div className="text-right shrink-0 hidden sm:block">
                        <div className="text-[11px] text-zinc-300">{h.isDraw?'Draw':`${res.method}`}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{res.method==='Decision'?'Decision':`R${res.round} · ${res.time}`}</div>
                      </div>
                      <div className="text-right shrink-0 w-14">
                        <div className="text-[9px] uppercase tracking-[0.1em] text-zinc-600">Elo</div>
                        {h.eloDelta!=null
                          ? <div className={`font-mono text-[12px] font-bold ${h.eloDelta>0?'text-emerald-400':h.eloDelta<0?'text-red-400':'text-zinc-500'}`}>{h.eloDelta>0?'+':''}{h.eloDelta}</div>
                          : <div className="font-mono text-[12px] text-zinc-700">—</div>}
                      </div>
                      <ChevronRight size={15} className="text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0"/>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        {/* ADVANCED STATS */}
        <section className="bg-[#0e0e12] border border-zinc-900 p-5">
          <h3 className="font-display text-lg tracking-tight text-zinc-100 mb-4 flex items-center gap-2"><BarChart3 size={14} className="text-zinc-500"/> ADVANCED STATISTICS</h3>
          <div className="space-y-3">
            {[
              ['Strikes landed / min', fr.slpm, 8, fr.slpm],
              ['Striking accuracy', fr.strAcc, 100, `${fr.strAcc}%`],
              ['Takedowns / 15 min', fr.tdAvg, 6, fr.tdAvg],
              ['Takedown accuracy', fr.tdAcc, 100, `${fr.tdAcc}%`],
              ['Submission attempts / 15 min', fr.subAvg, 3, fr.subAvg],
              ['Career win rate', winPct, 100, `${winPct}%`],
            ].map(([l,val,max,disp])=>(
              <div key={l}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-400">{l}</span>
                  <span className="font-mono text-zinc-200">{disp}</span>
                </div>
                <div className="h-2 bg-zinc-900 overflow-hidden rounded-sm">
                  <div className="h-full transition-all duration-700" style={{width:`${Math.min(100,(val/max)*100)}%`,background:fr.color}}/>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RADAR vs DIVISION */}
        <section className="bg-[#0e0e12] border border-zinc-900 p-5">
          <h3 className="font-display text-lg tracking-tight text-zinc-100 mb-1 flex items-center gap-2"><Target size={14} className="text-zinc-500"/> PROFILE vs DIVISION</h3>
          <p className="text-[11px] text-zinc-500 mb-2">Fighter (red) against {fr.division} averages (grey)</p>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radar}>
              <PolarGrid stroke="#27272a"/>
              <PolarAngleAxis dataKey="stat" tick={{fill:'#a1a1aa',fontSize:10,fontFamily:'monospace'}}/>
              <PolarRadiusAxis stroke="#27272a" tick={false} axisLine={false}/>
              <Radar dataKey="div" stroke="#52525b" fill="#52525b" fillOpacity={0.15} strokeWidth={1.5}/>
              <Radar dataKey="me" stroke="#dc2626" fill="#dc2626" fillOpacity={0.3} strokeWidth={2}/>
              <Tooltip contentStyle={{background:'#0a0a0c',border:'1px solid #27272a',fontSize:11,fontFamily:'monospace'}}/>
            </RadarChart>
          </ResponsiveContainer>
        </section>

        {/* FINISH PROFILE */}
        <section className="bg-[#0e0e12] border border-zinc-900 p-5">
          <h3 className="font-display text-lg tracking-tight text-zinc-100 mb-1 flex items-center gap-2"><Crosshair size={14} className="text-zinc-500"/> FINISH PROFILE</h3>
          <p className="text-[11px] text-zinc-500 mb-3">Modeled win-method tendency from striking & grappling metrics</p>
          <div className="space-y-2.5">
            {methodSplit.map(m=>(
              <div key={m.label}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-400">{m.label}</span>
                  <span className="font-mono text-zinc-200">{m.v}%</span>
                </div>
                <div className="h-2.5 bg-zinc-900 overflow-hidden rounded-sm">
                  <div className="h-full transition-all duration-700" style={{width:`${m.v}%`,background:m.c}}/>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-zinc-900 text-[10px] text-zinc-600">
            Tendency is inferred from the fighter's statistical profile — not official UFC career method splits.
          </div>
        </section>

        {/* SCOUTING */}
        <section className="bg-[#0e0e12] border border-zinc-900 p-5">
          <h3 className="font-display text-lg tracking-tight text-zinc-100 mb-3 flex items-center gap-2"><BookOpen size={14} className="text-zinc-500"/> SCOUTING REPORT</h3>
          <p className="text-[13px] text-zinc-300 leading-relaxed">{fr.notes}</p>
          <div className="mt-4 pt-3 border-t border-zinc-900 grid grid-cols-2 gap-3 text-[11px]">
            <div><div className="text-[9px] uppercase tracking-[0.12em] text-zinc-600">Recent form</div>
              <div className={`font-mono ${fr.streak.startsWith('W')?'text-emerald-400':'text-red-400'}`}>{fr.streak} · {fr.last}</div></div>
            <div><div className="text-[9px] uppercase tracking-[0.12em] text-zinc-600">Primary style</div>
              <div className="text-zinc-200">{fr.style}</div></div>
          </div>
        </section>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// COMPARE
// ═══════════════════════════════════════════════════════════════════════

const Compare = () => {
  const [l, setL] = useState('topuria');
  const [r, setR] = useState('makhachev');
  const lf = f(l), rf = f(r);
  const pred = predictFight(lf, rf);
  const radar = [
    { stat:'SLpM', a:(lf.slpm??0)*10, b:(rf.slpm??0)*10 },
    { stat:'Str Acc', a:lf.strAcc??0, b:rf.strAcc??0 },
    { stat:'TD/15m', a:(lf.tdAvg??0)*15, b:(rf.tdAvg??0)*15 },
    { stat:'TD Acc', a:lf.tdAcc??0, b:rf.tdAcc??0 },
    { stat:'Subs', a:(lf.subAvg??0)*30, b:(rf.subAvg??0)*30 },
    { stat:'Win%', a:pred.comp.aPct, b:pred.comp.bPct },
  ];
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <PageHead icon={Swords} tag="Tool" title="FIGHTER COMPARISON"
        desc="Run any two fighters through the model for a hypothetical-matchup probability."/>
      <div className="grid sm:grid-cols-[1fr_auto_1fr] items-center gap-4 mb-6">
        {[[l,setL,lf,false],[r,setR,rf,true]].map(([val,set,fr,mir],idx)=>(
          <React.Fragment key={idx}>
            {idx===1 && <div className="font-display text-3xl text-zinc-800 text-center">VS</div>}
            <div className="bg-[#0e0e12] border border-zinc-900 p-5">
              <select value={val} onChange={e=>set(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-800 px-3 py-2 text-zinc-200 text-sm font-mono mb-4">
                {Object.values(FIGHTERS).map(x=><option key={x.id} value={x.id}>{x.name} · {x.division}</option>)}
              </select>
              <div className="flex items-center gap-4">
                <Avatar fighter={fr} size={72} mirror={mir}/>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">{fr.country} {fr.rank==='C'?'· CHAMP':fr.rank?`· #${fr.rank}`:''}</div>
                  <h2 className="font-display text-xl text-zinc-100 tracking-tight leading-none">{fr.name.toUpperCase()}</h2>
                  <div className="font-mono text-xs text-zinc-400 mt-1">{fr.record} · {fr.weight}</div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="bg-[#0e0e12] border border-zinc-900 p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg tracking-tight text-zinc-100">HYPOTHETICAL MATCHUP</h3>
          <Pill tone={lf.division!==rf.division?'amber':'neutral'}>{lf.division!==rf.division?'Cross-Division':'Same Division'}</Pill>
        </div>
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className="font-display text-4xl text-zinc-100 tabular-nums">{pred.aProb}%</div>
            <div className="text-[11px] text-zinc-500 uppercase tracking-[0.12em] mt-1">{lf.name.split(' ').slice(-1)[0]}</div>
          </div>
          <div className="font-display text-xl text-zinc-700">{pred.confidence}</div>
          <div className="text-center">
            <div className="font-display text-4xl text-zinc-100 tabular-nums">{pred.bProb}%</div>
            <div className="text-[11px] text-zinc-500 uppercase tracking-[0.12em] mt-1">{rf.name.split(' ').slice(-1)[0]}</div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-zinc-900 grid grid-cols-3 gap-3 text-[12px]">
          <div><span className="text-zinc-500">Method:</span> <span className="text-zinc-200 font-mono">{pred.primary}</span></div>
          {pred.roundWin && <div><span className="text-zinc-500">Window:</span> <span className="text-zinc-200 font-mono">{pred.roundWin}</span></div>}
          <div><span className="text-zinc-500">Risk:</span> <span className="text-zinc-200 font-mono">{pred.risk}/10</span></div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <section className="bg-[#0e0e12] border border-zinc-900 p-5">
          <h3 className="font-display text-lg tracking-tight text-zinc-100 mb-4">STAT-BY-STAT</h3>
          <div className="space-y-2.5">
            {[['Age',lf.age,rf.age],['Reach',lf.reach,rf.reach],['Wins',lf.wins,rf.wins],
              ['SLpM',lf.slpm,rf.slpm],['Str Acc',lf.strAcc,rf.strAcc],['TD/15m',lf.tdAvg,rf.tdAvg],
              ['TD Acc',lf.tdAcc,rf.tdAcc],['Sub/15m',lf.subAvg,rf.subAvg]].map(([lab,v1,v2])=>{
              const n1=parseFloat(v1),n2=parseFloat(v2);
              return (
                <div key={lab}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-mono text-zinc-300">{v1??'—'}</span>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">{lab}</span>
                    <span className="font-mono text-zinc-300">{v2??'—'}</span>
                  </div>
                  <StatBar left={n1||0} right={n2||0}/>
                </div>
              );
            })}
          </div>
        </section>
        <section className="bg-[#0e0e12] border border-zinc-900 p-5">
          <h3 className="font-display text-lg tracking-tight text-zinc-100 mb-3">STYLE OVERLAP</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radar}>
              <PolarGrid stroke="#27272a"/>
              <PolarAngleAxis dataKey="stat" tick={{fill:'#a1a1aa',fontSize:10,fontFamily:'monospace'}}/>
              <PolarRadiusAxis stroke="#27272a" tick={false} axisLine={false}/>
              <Radar dataKey="a" stroke="#dc2626" fill="#dc2626" fillOpacity={0.25} strokeWidth={2}/>
              <Radar dataKey="b" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.18} strokeWidth={2}/>
            </RadarChart>
          </ResponsiveContainer>
        </section>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// METHODOLOGY
// ═══════════════════════════════════════════════════════════════════════

const Methodology = () => (
  <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
    <PageHead icon={Beaker} tag="Transparency · Honest mode" title="HOW PREDICTIONS WORK"
      desc="Exactly how every prediction on this site is computed. No black box, no proprietary AI claims."/>
    <div className="space-y-7">
      <section className="bg-amber-950/20 border-l-2 border-amber-700 pl-4 py-3">
        <h2 className="font-display text-lg text-zinc-100 mb-2 flex items-center gap-2"><AlertCircle size={15} className="text-amber-500"/> WHAT THIS IS NOT</h2>
        <p className="text-[13px] text-zinc-300 leading-relaxed">This is <strong>not</strong> a trained ML model — no XGBoost, no neural net trained on fight history. It is <strong>not</strong> connected to a live odds API; market lines were retrieved via web research at one point in time. Predictions are <strong>discussion-grade</strong>, not betting-grade, and have not been calibration-validated.</p>
      </section>
      <section>
        <h2 className="font-display text-xl text-zinc-100 mb-3 flex items-center gap-2"><Code size={16} className="text-sky-500"/> THE FORMULA</h2>
        <div className="bg-[#0e0e12] border border-zinc-900 p-5 font-mono text-[12px] text-zinc-300 leading-[1.85] overflow-x-auto">
          <div className="text-zinc-500">// per fighter</div>
          <div><span className="text-sky-400">striking_output</span> = SLpM × (StrAcc/100)</div>
          <div><span className="text-sky-400">grappling_threat</span> = TDavg×(TDacc/100) + SubAvg×0.3</div>
          <div><span className="text-sky-400">age_penalty</span> = max(0, age−32) × 0.035</div>
          <div><span className="text-sky-400">win_pct</span> = wins / (wins+losses)</div>
          <div className="mt-2 text-zinc-500">// composite rating</div>
          <div><span className="text-emerald-400">rating</span> = striking_output×<span className="text-amber-400">0.85</span> + grappling_threat×<span className="text-amber-400">0.65</span></div>
          <div className="pl-8">+ reach_diff×<span className="text-amber-400">0.04</span> + win_pct×<span className="text-amber-400">0.7</span></div>
          <div className="pl-8">+ champ_bonus(<span className="text-amber-400">0.18</span>) − age_penalty</div>
          <div className="mt-2 text-zinc-500">// probability</div>
          <div><span className="text-red-400">prob</span> = 1 / (1 + exp(−(rating_a−rating_b)×<span className="text-amber-400">0.85</span>))</div>
        </div>
      </section>
      <section>
        <h2 className="font-display text-xl text-zinc-100 mb-3">DATA SOURCES</h2>
        <div className="space-y-2 text-[13px] text-zinc-400">
          {[
            ['Fighter striking/grappling stats','UFC.com athlete pages'],
            ['Records, age, reach, stance','UFC.com / Wikipedia / MVP'],
            ['Upcoming events & cards','UFC.com · ESPN · Tapology · Netflix'],
            ['Market odds (where shown)','Yahoo Sports · UFC.com · Covers'],
            ['P4P rankings','ESPN · Yahoo · CBS consensus'],
            ['Past fight results','Wikipedia · UFC.com'],
            ['Data snapshot','May 15, 2026'],
          ].map(([k,v])=>(
            <div key={k} className="flex justify-between border-b border-zinc-900 pb-2">
              <span>{k}</span><span className="font-mono text-zinc-500 text-right">{v}</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-display text-xl text-zinc-100 mb-3">KNOWN LIMITATIONS</h2>
        <ul className="space-y-2 text-[13px] text-zinc-400">
          {[
            'No striking defense, takedown defense, or strikes-absorbed metrics.',
            'No style-matchup modeling beyond raw stats.',
            'No injury, weight-cut, layoff, altitude or travel data.',
            'No backtest at scale — accuracy page uses a tiny illustrative sample.',
            'No probability calibration — a 70% pick may not win 70% of the time.',
            'Prop odds (method, totals, finish) are model-derived, not real market lines.',
          ].map((t,i)=>(
            <li key={i} className="flex gap-2"><X size={14} className="text-red-500 mt-0.5 shrink-0"/>{t}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="font-display text-xl text-zinc-100 mb-3 flex items-center gap-2"><Check size={16} className="text-emerald-500"/> WHAT WOULD MAKE THIS REAL</h2>
        <ol className="space-y-2 text-[13px] text-zinc-400 list-decimal pl-5">
          <li>Ingest the full UFC fight history (10,000+ bouts) from UFC Stats / Sherdog.</li>
          <li>Engineer ~100 features including the defensive metrics left out here.</li>
          <li>Train a calibrated XGBoost/LightGBM classifier with walk-forward backtesting.</li>
          <li>Validate with log loss, Brier score and closing-line value — not just accuracy.</li>
          <li>Add isotonic regression for honest probability calibration.</li>
          <li>Connect a paid odds API (~$200/mo) for live multi-book market data.</li>
        </ol>
        <p className="text-[13px] text-zinc-400 mt-3 leading-relaxed">
          Even fully built, the realistic moneyline-accuracy ceiling is <span className="font-mono text-zinc-100">65–73%</span> — Vegas closes in the same band. Anyone claiming 80%+ is overfitting or cherrypicking.
        </p>
      </section>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════

const Footer = ({ setView }) => (
  <footer className="border-t border-zinc-900 mt-12 bg-[#08080a]">
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
      <div className="col-span-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 bg-red-600 rotate-45"/>
            <div className="absolute inset-[2px] bg-[#08080a] rotate-45"/>
            <div className="absolute inset-[5px] bg-red-600 rotate-45"/>
          </div>
          <span className="font-display text-lg tracking-[0.13em] text-zinc-100">OCTAGON<span className="text-red-500">.AI</span></span>
        </div>
        <p className="text-[11px] text-zinc-500 leading-relaxed max-w-md">
          MMA fight prediction prototype with real fighter data and a transparent heuristic model.
          Not affiliated with the UFC, Zuffa LLC, or MVP. Fighter names and stats are property of their respective owners.
        </p>
        <p className="text-[10px] text-zinc-700 mt-3">
          Predictions are for analytical discussion — not financial or betting advice. Gambling problem? Call 1-800-GAMBLER. 21+.
        </p>
      </div>
      {[
        { title:'Platform', items:[['Home','home'],['Events','events'],['Betting','betting'],['Matchup Lab','lab']] },
        { title:'Analysis', items:[['Elo Rankings','rankings'],['Performance','performance'],['Fighters','fighters'],['Model','methodology']] },
      ].map(col=>(
        <div key={col.title}>
          <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500 mb-3">{col.title}</div>
          <ul className="space-y-2">
            {col.items.map(([l,v])=>(
              <li key={v}><button onClick={()=>setView(v)} className="text-[12px] text-zinc-400 hover:text-zinc-100">{l}</button></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-zinc-900 px-4 sm:px-6 py-4 max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] text-zinc-600">
      <span>© 2026 Octagon.AI prototype</span>
      <span className="font-mono">Heuristic v1.0 · data snapshot May 15, 2026</span>
    </div>
  </footer>
);

// ═══════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════
// CUSTOM CARD BUILDER — fantasy matchup simulator on the prediction engine
// (Custom cards never touch official records — they run the same published
//  heuristic used everywhere else, and save on-device via the storage API.)
// ═══════════════════════════════════════════════════════════════════════

const CB_KEY = 'octagon_custom_cards_v1';

const CB_fmtOdds = v => (v>0?'+':'')+v;

const CardBuilder = () => {
  const ROSTER = useMemo(()=>Object.values(FIGHTERS).sort((a,b)=>a.name.localeCompare(b.name)),[]);
  const [bouts, setBouts] = useState([{ id:1, a:null, b:null }]);
  const [eventName, setEventName] = useState('My Custom Card');
  const [picking, setPicking] = useState(null);   // { boutId, slot }
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState([]);
  const nextId = useRef(2);

  useEffect(()=>{
    let live = true;
    (async()=>{
      try {
        if (typeof window!=='undefined' && window.storage) {
          const r = await window.storage.get(CB_KEY);
          if (live && r && r.value) setSaved(JSON.parse(r.value));
        }
      } catch(e){ /* first run / no store */ }
    })();
    return ()=>{ live=false; };
  },[]);

  const persist = next => {
    setSaved(next);
    try { if (typeof window!=='undefined' && window.storage) window.storage.set(CB_KEY, JSON.stringify(next)); } catch(e){}
  };

  const addBout    = () => setBouts(b=>[...b,{ id:nextId.current++, a:null, b:null }]);
  const removeBout = id => setBouts(b=>b.length>1?b.filter(x=>x.id!==id):b);
  const move = (id,dir) => setBouts(b=>{
    const i=b.findIndex(x=>x.id===id), j=i+dir;
    if (j<0||j>=b.length) return b;
    const n=[...b]; [n[i],n[j]]=[n[j],n[i]]; return n;
  });
  const pick = fid => { if (picking){ setBouts(b=>b.map(x=>x.id===picking.boutId?{...x,[picking.slot]:fid}:x)); setPicking(null); setQuery(''); } };

  const saveCard = () => {
    const nm = (eventName.trim()||'Custom Card');
    persist([{ id:Date.now(), name:nm, bouts:bouts.map(x=>({a:x.a,b:x.b})) },
             ...saved.filter(c=>c.name!==nm)].slice(0,10));
  };
  const loadCard = c => { setEventName(c.name); setBouts(c.bouts.map((x,i)=>({id:i+1,a:x.a,b:x.b}))); nextId.current=c.bouts.length+1; };
  const delCard  = id => persist(saved.filter(c=>c.id!==id));

  const filtered = query.trim()
    ? ROSTER.filter(ft=>ft.name.toLowerCase().includes(query.trim().toLowerCase()))
    : ROSTER;

  const sim = bouts.map((x,i)=>{
    if (!x.a||!x.b) return { bout:x, status:'empty' };
    if (x.a===x.b)  return { bout:x, status:'same' };
    const a=f(x.a), b=f(x.b), p=predictFight(a,b,i===0?5:3);
    return { bout:x, status:'ok', a, b, p };
  });
  const ok = sim.filter(s=>s.status==='ok');
  const avgConf = ok.length?Math.round(ok.reduce((s,x)=>s+x.p.confScore,0)/ok.length):0;
  const finishes = ok.filter(x=>x.p.primary!=='Decision').length;

  const slotLabel = (i,n) => i===0?'MAIN EVENT':(i===1&&n>1?'CO-MAIN EVENT':`BOUT ${n-i}`);

  const FighterCell = ({ fid, boutId, slot }) => {
    const ft = fid?f(fid):null;
    return (
      <button onClick={()=>{ setPicking({boutId,slot}); setQuery(''); }}
        className={`flex-1 min-w-0 flex items-center gap-2.5 px-3 py-2.5 border transition-colors text-left ${
          ft?'border-zinc-800 bg-[#0c0c10] hover:border-zinc-600':'border-dashed border-zinc-700 bg-transparent hover:border-zinc-500'}`}>
        {ft ? <Avatar fighter={ft} size={38}/> :
          <div className="w-[38px] h-[38px] grid place-items-center border border-zinc-800 text-zinc-600 shrink-0"><Plus size={16}/></div>}
        <div className="min-w-0">
          {ft ? <>
            <div className="font-display text-[15px] text-zinc-100 leading-tight truncate">{ft.name}</div>
            <div className="text-[10px] text-zinc-500 font-mono">{ft.division} · {ft.record}</div>
          </> : <span className="text-[12px] text-zinc-500">Select fighter</span>}
        </div>
      </button>
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <PageHead icon={Swords} tag="Fantasy matchup simulator"
        title="CUSTOM CARD BUILDER"
        desc="Build any card you want, drop in any two fighters, and run them through the same prediction engine the rest of the platform uses."/>

      <div className="bg-amber-950/20 border border-amber-800/50 rounded-sm p-3.5 mb-6 flex gap-3">
        <Info size={15} className="text-amber-500 mt-0.5 shrink-0"/>
        <p className="text-[12px] text-zinc-300 leading-relaxed">
          Custom cards are sandboxed — they never change official fighter records, Elo, or analytics. Each matchup runs the
          published heuristic (striking, grappling, reach, age, form, Elo) — a transparent model, not a real trained AI. Saved cards persist on this device.
        </p>
      </div>

      {/* EVENT NAME + SAVE */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input value={eventName} onChange={e=>setEventName(e.target.value)} maxLength={42}
          className="flex-1 min-w-[200px] px-3 py-2 bg-zinc-900/70 border border-zinc-800 rounded-sm text-[14px] text-zinc-100 font-display tracking-tight focus:border-zinc-600 outline-none"/>
        <button onClick={saveCard}
          className="px-3.5 py-2 bg-red-600 hover:bg-red-500 border border-red-500 rounded-sm text-[12px] text-white font-semibold flex items-center gap-1.5 transition-colors">
          <Check size={13}/> Save Card
        </button>
        <button onClick={addBout}
          className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-sm text-[12px] text-zinc-200 font-semibold flex items-center gap-1.5 transition-colors">
          <Plus size={13}/> Add Bout
        </button>
      </div>

      {/* SAVED CARDS */}
      {saved.length>0 && (
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-600 flex items-center gap-1"><Layers size={12}/> Saved</span>
          {saved.map(c=>(
            <span key={c.id} className="flex items-center bg-zinc-900/70 border border-zinc-800 rounded-sm overflow-hidden">
              <button onClick={()=>loadCard(c)} className="px-2.5 py-1 text-[11px] text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">
                {c.name} <span className="text-zinc-600 font-mono">· {c.bouts.length}</span>
              </button>
              <button onClick={()=>delCard(c.id)} className="px-1.5 py-1 text-zinc-600 hover:text-red-400 border-l border-zinc-800"><X size={12}/></button>
            </span>
          ))}
        </div>
      )}

      {/* BOUT EDITORS */}
      <div className="space-y-2.5 mb-6">
        {bouts.map((bt,i)=>(
          <div key={bt.id} className="border border-zinc-900 bg-[#0e0e12]">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-900 bg-[#0c0c10]">
              <span className={`text-[10px] uppercase tracking-[0.16em] font-semibold ${i===0?'text-red-400':i===1?'text-amber-400':'text-zinc-500'}`}>
                {slotLabel(i,bouts.length)}
              </span>
              <div className="flex items-center gap-0.5">
                <button onClick={()=>move(bt.id,-1)} disabled={i===0}
                  className="p-1 text-zinc-600 hover:text-zinc-200 disabled:opacity-25 disabled:hover:text-zinc-600"><ArrowUp size={13}/></button>
                <button onClick={()=>move(bt.id,1)} disabled={i===bouts.length-1}
                  className="p-1 text-zinc-600 hover:text-zinc-200 disabled:opacity-25 disabled:hover:text-zinc-600"><ArrowDown size={13}/></button>
                <button onClick={()=>removeBout(bt.id)} disabled={bouts.length<=1}
                  className="p-1 text-zinc-600 hover:text-red-400 disabled:opacity-25"><X size={13}/></button>
              </div>
            </div>
            <div className="flex items-stretch gap-2 p-2.5">
              <FighterCell fid={bt.a} boutId={bt.id} slot="a"/>
              <div className="grid place-items-center px-1 font-display text-zinc-700 text-sm shrink-0">VS</div>
              <FighterCell fid={bt.b} boutId={bt.id} slot="b"/>
            </div>
            {bt.a&&bt.b&&bt.a===bt.b && (
              <div className="px-3 pb-2.5 -mt-1 text-[11px] text-amber-400 flex items-center gap-1.5">
                <AlertTriangle size={12}/> Pick two different fighters to simulate this bout.
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CUSTOM EVENT PAGE / SIMULATION */}
      {ok.length>0 && (
        <>
          <div className="flex items-end justify-between mb-3 border-b border-zinc-900 pb-2">
            <h2 className="font-display text-2xl sm:text-3xl text-zinc-100 tracking-tight leading-none">{eventName||'Custom Card'}</h2>
            <div className="flex gap-4 text-right shrink-0">
              <div><div className="font-mono text-lg text-sky-400 font-bold tabular-nums">{ok.length}</div><div className="text-[9px] uppercase tracking-[0.12em] text-zinc-600">bouts</div></div>
              <div><div className="font-mono text-lg text-purple-400 font-bold tabular-nums">{avgConf}%</div><div className="text-[9px] uppercase tracking-[0.12em] text-zinc-600">avg conf</div></div>
              <div><div className="font-mono text-lg text-red-400 font-bold tabular-nums">{finishes}</div><div className="text-[9px] uppercase tracking-[0.12em] text-zinc-600">finishes</div></div>
            </div>
          </div>

          <div className="space-y-3">
            {sim.map((s,i)=>{
              if (s.status!=='ok') return null;
              const { a,b,p } = s;
              const aWin = p.aProb>=p.bProb;
              const win = aWin?a:b, los = aWin?b:a;
              const winProb = Math.max(p.aProb,p.bProb), dogProb = Math.min(p.aProb,p.bProb);
              const eA = eloOf(a.id), eB = eloOf(b.id);
              const winOdds = probToAmerican(winProb), dogOdds = probToAmerican(dogProb);
              const km = p.methods.find(m=>m.name==='KO/TKO')?.value||0;
              const sm = p.methods.find(m=>m.name==='Submission')?.value||0;
              const dm = p.methods.find(m=>m.name==='Decision')?.value||0;
              return (
                <div key={s.bout.id} className="border border-zinc-900 bg-[#0e0e12] overflow-hidden">
                  <div className="px-3 py-1.5 border-b border-zinc-900 bg-[#0c0c10] flex items-center justify-between">
                    <span className={`text-[10px] uppercase tracking-[0.16em] font-semibold ${i===0?'text-red-400':i===1?'text-amber-400':'text-zinc-500'}`}>{slotLabel(i,bouts.length)}</span>
                    <span className="text-[10px] text-zinc-600 font-mono">{a.division==b.division?a.division:'Catchweight'}</span>
                  </div>
                  {/* fighters */}
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 p-3">
                    {[a,b].map((ft,idx)=>{
                      const isWin = (idx===0)===aWin;
                      return (
                        <div key={ft.id} className={`flex items-center gap-2.5 ${idx===1?'flex-row-reverse text-right':''}`}>
                          <Avatar fighter={ft} size={52} mirror={idx===1}/>
                          <div className="min-w-0">
                            <div className={`font-display text-[16px] leading-tight truncate ${isWin?'text-zinc-100':'text-zinc-400'}`}>{ft.name}</div>
                            <div className="text-[10px] text-zinc-600 font-mono">{ft.record} · Elo {idx===0?eA:eB}</div>
                            <div className={`font-mono text-lg font-bold tabular-nums ${isWin?'text-emerald-400':'text-zinc-500'}`}>{idx===0?p.aProb:p.bProb}%</div>
                          </div>
                        </div>
                      );
                    })}
                    <div className="grid place-items-center">
                      <div className="font-display text-zinc-700 text-xs">VS</div>
                    </div>
                  </div>
                  {/* probability bar */}
                  <div className="px-3">
                    <div className="flex h-2 rounded-sm overflow-hidden bg-zinc-900">
                      <div className="h-full bg-emerald-500" style={{width:`${p.aProb}%`}}/>
                      <div className="h-full bg-red-600" style={{width:`${p.bProb}%`}}/>
                    </div>
                  </div>
                  {/* prediction grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-900 mt-3 border-t border-zinc-900">
                    <div className="bg-[#0e0e12] px-3 py-2.5">
                      <div className="text-[9px] uppercase tracking-[0.12em] text-zinc-600">AI Pick</div>
                      <div className="font-display text-[15px] text-zinc-100 truncate">{win.name.split(' ').slice(-1)[0]}</div>
                      <div className="font-mono text-[11px] text-emerald-400">{winProb}% · {CB_fmtOdds(winOdds)}</div>
                    </div>
                    <div className="bg-[#0e0e12] px-3 py-2.5">
                      <div className="text-[9px] uppercase tracking-[0.12em] text-zinc-600">Method</div>
                      <div className="font-display text-[15px] text-zinc-100">{p.primary}</div>
                      <div className="font-mono text-[11px] text-zinc-500">{p.roundWin || 'Scorecards'}</div>
                    </div>
                    <div className="bg-[#0e0e12] px-3 py-2.5">
                      <div className="text-[9px] uppercase tracking-[0.12em] text-zinc-600">Upset Risk</div>
                      <div className="font-display text-[15px] text-amber-400">{dogProb}%</div>
                      <div className="font-mono text-[11px] text-zinc-500">{los.name.split(' ').slice(-1)[0]} {CB_fmtOdds(dogOdds)}</div>
                    </div>
                    <div className="bg-[#0e0e12] px-3 py-2.5">
                      <div className="text-[9px] uppercase tracking-[0.12em] text-zinc-600">Elo Edge</div>
                      <div className={`font-display text-[15px] ${Math.abs(eA-eB)<20?'text-zinc-300':(eA>eB)===aWin?'text-emerald-400':'text-red-400'}`}>{eA===eB?'Even':`${Math.abs(eA-eB)}`}</div>
                      <div className="font-mono text-[11px] text-zinc-500">{eA>eB?a.name.split(' ').slice(-1)[0]:b.name.split(' ').slice(-1)[0]} higher</div>
                    </div>
                  </div>
                  {/* method split */}
                  <div className="px-3 py-2.5 border-t border-zinc-900">
                    <div className="flex gap-1 text-[9px] font-mono mb-1">
                      <span className="text-red-400">KO {km}%</span>
                      <span className="text-sky-400">SUB {sm}%</span>
                      <span className="text-zinc-400">DEC {dm}%</span>
                    </div>
                    <div className="flex h-1.5 rounded-sm overflow-hidden bg-zinc-900">
                      <div className="h-full bg-red-600" style={{width:`${km}%`}}/>
                      <div className="h-full bg-sky-500" style={{width:`${sm}%`}}/>
                      <div className="h-full bg-zinc-600" style={{width:`${dm}%`}}/>
                    </div>
                  </div>
                  {/* breakdown */}
                  <div className="px-3 py-2.5 border-t border-zinc-900 bg-[#0c0c10]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Cpu size={11} className="text-purple-400"/>
                      <span className="text-[9px] uppercase tracking-[0.14em] text-zinc-500">Model breakdown</span>
                    </div>
                    <p className="text-[12px] text-zinc-400 leading-relaxed">{buildExplanation(a,b,p)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {ok.length===0 && (
        <div className="border border-dashed border-zinc-800 rounded-sm p-10 text-center">
          <Swords size={26} className="text-zinc-700 mx-auto mb-2"/>
          <p className="text-[13px] text-zinc-500">Pick two fighters in a bout above to generate AI matchup predictions.</p>
        </div>
      )}

      {/* FIGHTER PICKER OVERLAY */}
      {picking && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm"
          onClick={()=>setPicking(null)}>
          <div className="w-full max-w-lg bg-[#0e0e12] border border-zinc-800 rounded-sm overflow-hidden mt-6 sm:mt-12"
            onClick={e=>e.stopPropagation()}>
            <div className="flex items-center gap-2 p-3 border-b border-zinc-900">
              <Search size={15} className="text-zinc-500"/>
              <input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search 247 fighters…"
                className="flex-1 bg-transparent text-[14px] text-zinc-100 outline-none placeholder:text-zinc-600"/>
              <button onClick={()=>setPicking(null)} className="text-zinc-500 hover:text-zinc-200"><X size={16}/></button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {filtered.slice(0,120).map(ft=>(
                <button key={ft.id} onClick={()=>pick(ft.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-900 border-b border-zinc-900/60 text-left transition-colors">
                  <Avatar fighter={ft} size={34}/>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-[14px] text-zinc-100 truncate">{ft.name}</div>
                    <div className="text-[10px] text-zinc-600 font-mono">{ft.division} · {ft.record}</div>
                  </div>
                  {ft.rank!=null && ft.rank!=='C' && <span className="text-[10px] font-mono text-zinc-600">#{ft.rank}</span>}
                </button>
              ))}
              {filtered.length===0 && <div className="p-6 text-center text-[12px] text-zinc-600">No fighters match “{query}”.</div>}
              {filtered.length>120 && <div className="p-3 text-center text-[11px] text-zinc-600">Showing first 120 — keep typing to narrow.</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// MATCHUP LAB — unified fighter comparison + custom card simulation
// ═══════════════════════════════════════════════════════════════════════

const MatchupLab = () => {
  const [tab, setTab] = useState('compare');
  return (
    <div>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 -mb-2">
        <div className="flex items-center gap-2">
          {[['compare','Fighter Compare',Crosshair],['builder','Card Builder',Swords]].map(([id,lbl,Ic])=>(
            <button key={id} onClick={()=>setTab(id)}
              className={`px-4 py-2 text-[12px] font-semibold tracking-wide rounded-sm border flex items-center gap-1.5 transition-colors ${
                tab===id?'bg-red-600 border-red-500 text-white':'bg-[#0e0e12] border-zinc-800 text-zinc-400 hover:text-zinc-100'}`}>
              <Ic size={13}/>{lbl}
            </button>
          ))}
        </div>
      </div>
      {tab==='compare' ? <Compare/> : <CardBuilder/>}
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════
// UFC ELO RANKINGS
// ═══════════════════════════════════════════════════════════════════════

const EloTrend = ({ id }) => {
  const d = eloDeltaOf(id);
  if (d===0) return <span className="font-mono text-[10px] text-zinc-700">— flat</span>;
  return (
    <span className={`font-mono text-[10px] ${d>0?'text-emerald-400':'text-red-400'} flex items-center gap-0.5`}>
      {d>0?<TrendingUp size={10}/>:<TrendingDown size={10}/>}{d>0?'+':''}{d}
    </span>
  );
};

const EloRankings = ({ openFighter }) => {
  const [div, setDiv] = useState('ALL');
  const [sort, setSort] = useState('elo');
  const top10 = ELO_BOARD.slice(0,10);

  let list = div==='ALL' ? ELO_BOARD.slice() : (ELO_DIV[div]||[]).slice(0,15);
  if (sort==='delta') list = [...list].sort((a,b)=>eloDeltaOf(b.id)-eloDeltaOf(a.id));
  else if (sort==='peak') list = [...list].sort((a,b)=>eloPeakOf(b.id)-eloPeakOf(a.id));
  else if (sort==='age') list = [...list].sort((a,b)=>a.age-b.age);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <PageHead icon={Gauge} tag="Model-derived rating system" title="UFC ELO RANKINGS"
        desc="A transparent Elo rating — seeded from each fighter's career profile, then updated by real results in the database."/>

      <div className="bg-amber-950/20 border border-amber-800/50 rounded-sm p-4 mb-6 flex gap-3">
        <Info size={16} className="text-amber-500 mt-0.5 shrink-0"/>
        <div className="text-[12px] text-zinc-300 leading-relaxed">
          <span className="text-amber-300 font-semibold">What this is.</span> The UFC publishes no official Elo — this is a
          model. Ratings start from a career seed (record, ranking, streak, age) and move via standard Elo exchanges on
          the {PAST_EVENTS.length} completed events stored here, with finish, title-fight and round multipliers. It covers the
          {' '}{Object.keys(FIGHTERS).length} fighters loaded from the active cards in this database — not the full ~700-athlete
          UFC roster, which a sandboxed app can't live-import or auto-sync.
        </div>
      </div>

      {/* OVERALL TOP 10 */}
      <div className="flex items-center gap-2 mb-3">
        <Trophy size={15} className="text-amber-500"/>
        <h2 className="font-display text-lg tracking-[0.08em] text-zinc-100">OVERALL TOP 10 BY ELO</h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {top10.map((fr,i)=>(
          <button key={fr.id} onClick={()=>openFighter(fr)}
            className="group text-left bg-[#0e0e12] border border-zinc-900 hover:border-zinc-600 transition-colors p-4 flex items-center gap-4">
            <span className={`font-display text-3xl tabular-nums w-10 text-center ${i===0?'text-amber-400':i===1?'text-zinc-300':i===2?'text-orange-700':'text-zinc-700'}`}>{i+1}</span>
            <Avatar fighter={fr} size={56}/>
            <div className="min-w-0 flex-1">
              <div className="font-display text-base text-zinc-100 tracking-tight truncate">{fr.name.toUpperCase()}</div>
              <div className="text-[10px] text-zinc-500 truncate">{DIVISIONS[fr.division]} · {fr.record} · {fr.last}</div>
              <div className="mt-1"><EloTrend id={fr.id}/></div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-mono text-2xl text-amber-400 tabular-nums font-bold leading-none">{eloOf(fr.id)}</div>
              <div className="text-[9px] text-zinc-600 mt-1">peak {eloPeakOf(fr.id)}</div>
              <div className={`text-[10px] font-mono mt-0.5 ${fr.streak.startsWith('W')?'text-emerald-400':'text-red-400'}`}>{fr.streak}</div>
            </div>
          </button>
        ))}
      </div>

      {/* DIVISIONAL */}
      <div className="flex items-center gap-2 mb-3">
        <Layers size={15} className="text-zinc-500"/>
        <h2 className="font-display text-lg tracking-[0.08em] text-zinc-100">DIVISIONAL RANKINGS</h2>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        {['ALL',...Object.keys(DIVISIONS)].map(d=>(
          <button key={d} onClick={()=>setDiv(d)}
            className={`px-2.5 py-1.5 text-[10px] uppercase tracking-[0.08em] font-medium border rounded-sm transition-colors ${
              div===d?'bg-red-600 border-red-500 text-white':'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}>
            {d==='ALL'?'All divisions':DIVISIONS[d]}
          </button>
        ))}
        <select value={sort} onChange={e=>setSort(e.target.value)}
          className="ml-auto px-3 py-1.5 bg-zinc-900/70 border border-zinc-800 rounded-sm text-[11px] text-zinc-200">
          <option value="elo">Sort: Elo</option>
          <option value="delta">Sort: Recent movement</option>
          <option value="peak">Sort: Peak Elo</option>
          <option value="age">Sort: Age</option>
        </select>
      </div>

      <div className="bg-[#0e0e12] border border-zinc-900">
        <div className="grid grid-cols-[40px_1fr_70px_70px_90px] sm:grid-cols-[48px_1fr_90px_80px_90px_110px] gap-2 px-4 py-2.5 border-b border-zinc-900 text-[9px] uppercase tracking-[0.12em] text-zinc-600">
          <div>Rank</div><div>Fighter</div><div className="text-right">Elo</div>
          <div className="text-right hidden sm:block">Peak</div><div className="text-right">Streak</div><div className="text-right">Trend</div>
        </div>
        <div className="divide-y divide-zinc-900">
          {list.map((fr,i)=>(
            <button key={fr.id} onClick={()=>openFighter(fr)}
              className="w-full grid grid-cols-[40px_1fr_70px_70px_90px] sm:grid-cols-[48px_1fr_90px_80px_90px_110px] gap-2 px-4 py-2.5 items-center hover:bg-[#131318] transition-colors text-left">
              <span className="font-display text-lg text-zinc-600 tabular-nums">{i+1}</span>
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar fighter={fr} size={34}/>
                <div className="min-w-0">
                  <div className="text-[13px] text-zinc-100 font-medium truncate">{fr.name}</div>
                  <div className="text-[10px] text-zinc-500 truncate">{fr.country} {fr.record} · {DIVISIONS[fr.division]}</div>
                </div>
              </div>
              <div className="font-mono text-sm text-amber-400 text-right tabular-nums font-bold">{eloOf(fr.id)}</div>
              <div className="font-mono text-[11px] text-zinc-500 text-right tabular-nums hidden sm:block">{eloPeakOf(fr.id)}</div>
              <div className={`font-mono text-[11px] text-right ${fr.streak.startsWith('W')?'text-emerald-400':'text-red-400'}`}>{fr.streak}</div>
              <div className="flex justify-end"><EloTrend id={fr.id}/></div>
            </button>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-zinc-600 mt-3">
        Showing {list.length} fighters{div!=='ALL'?` · ${DIVISIONS[div]} top 15`:''}. Tap any fighter for their full Elo
        history, divisional rank and projected rating swing.
      </p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// CONSOLIDATED HUBS — tabbed page groupings
// ═══════════════════════════════════════════════════════════════════════

const HubTabs = ({ tabs, tab, setTab }) => (
  <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-6">
    <div className="flex gap-0.5 sm:gap-1 border-b border-zinc-900 overflow-x-auto">
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>setTab(t.id)}
          className={`px-3 sm:px-4 py-2.5 text-[11px] sm:text-[12px] uppercase tracking-[0.1em] font-medium flex items-center gap-1.5 border-b-2 -mb-px whitespace-nowrap transition-colors ${
            tab===t.id?'border-red-500 text-white':'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
          <t.icon size={13}/> {t.label}
        </button>
      ))}
    </div>
  </div>
);

const BettingHub = ({ openFight }) => {
  const [tab,setTab] = useState('picks');
  const tabs = [
    { id:'picks', label:'AI Picks', icon:Sparkles },
    { id:'value', label:'Best Bets & Edges', icon:Crosshair },
    { id:'parlays', label:'Parlay Builder', icon:ListChecks },
  ];
  return (
    <div>
      <HubTabs tabs={tabs} tab={tab} setTab={setTab}/>
      {tab==='picks' && <AiPicks openFight={openFight}/>}
      {tab==='value' && <Analytics openFight={openFight}/>}
      {tab==='parlays' && <Parlays openFight={openFight}/>}
    </div>
  );
};

const PerformanceHub = () => {
  const [tab,setTab] = useState('results');
  const tabs = [
    { id:'results', label:'Historical Results', icon:History },
    { id:'all', label:'All Predictions', icon:BarChart3 },
    { id:'high', label:'High Confidence 60%+', icon:Target },
  ];
  return (
    <div>
      <HubTabs tabs={tabs} tab={tab} setTab={setTab}/>
      {tab==='results' && <Results/>}
      {tab==='all' && <BetTracker minConf={0} label="ALL AI PREDICTIONS"
        sublabel="Every graded AI prediction in the database — full simulated betting performance."/>}
      {tab==='high' && <BetTracker minConf={60} label="HIGH CONFIDENCE PICKS (60%+)" showCompare
        sublabel="Only AI picks carrying model confidence above 60%, benchmarked against all picks."/>}
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedFight, setSelectedFight] = useState(null);
  const [selectedFighter, setSelectedFighter] = useState(null);
  const [loading, setLoading] = useState(false);

  const nav = (v) => {
    setLoading(true);
    setView(v);
    window.scrollTo(0,0);
    setTimeout(()=>setLoading(false), 220);
  };
  const openEvent = (ev) => { setSelectedEvent(ev); nav('event'); };
  const openFight = (ev, bout) => { setSelectedEvent(ev); setSelectedFight({event:ev,bout}); nav('fight'); };
  const openFighter = (fr) => { setSelectedFighter(fr); nav('fighter'); };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        :where(*) { font-family: 'Manrope', system-ui, sans-serif; }
        .font-display { font-family: 'Oswald', sans-serif; font-weight: 600; letter-spacing: -0.01em; }
        .font-mono, [class*="font-mono"] { font-family: 'JetBrains Mono', monospace; }
        .tabular-nums { font-variant-numeric: tabular-nums; }
        ::selection { background: #dc2626; color: white; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #0a0a0c; }
        ::-webkit-scrollbar-thumb { background: #27272a; }
        ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
        button, select { font-family: inherit; }
      `}</style>

      <Nav view={view} setView={nav}/>
      <TransparencyBanner setView={nav}/>

      <main>
        {loading && (
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-3">
            <Skeleton className="h-10 w-64"/>
            <Skeleton className="h-32 w-full"/>
            <div className="grid sm:grid-cols-3 gap-3">
              <Skeleton className="h-40"/><Skeleton className="h-40"/><Skeleton className="h-40"/>
            </div>
          </div>
        )}
        {!loading && view==='home' && <Home setView={nav} openFight={openFight} openEvent={openEvent} openFighter={openFighter}/>}
        {!loading && view==='events' && <EventsList openEvent={openEvent}/>}
        {!loading && view==='event' && <EventDetail event={selectedEvent} openFight={openFight} setView={nav}/>}
        {!loading && view==='fight' && <FightDetail selected={selectedFight} setView={nav} openEvent={openEvent}/>}
        {!loading && view==='betting' && <BettingHub openFight={openFight}/>}
        {!loading && view==='lab' && <MatchupLab/>}
        {!loading && view==='rankings' && <EloRankings openFighter={openFighter}/>}
        {!loading && view==='performance' && <PerformanceHub/>}
        {!loading && view==='fighters' && <Fighters openFighter={openFighter}/>}
        {!loading && view==='fighter' && <FighterProfile fighter={selectedFighter} setView={nav} openFight={openFight}/>}
        {!loading && view==='methodology' && <Methodology/>}
      </main>

      <Footer setView={nav}/>
    </div>
  );
}
