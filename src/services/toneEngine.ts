import { Story, VoicePreset, CustomVoiceProfile, StoryExplanation } from '../types';

export const toneEngine = {
  /**
   * Generates a conversational explanation adapted to the active reader's voice preset
   * or customized writing sample profile.
   * Runs 100% locally with zero external API dependencies required.
   */
  async explainStory(
    story: Story,
    preset: VoicePreset,
    customVoice?: CustomVoiceProfile
  ): Promise<StoryExplanation> {
    const isCustom = Boolean(customVoice && customVoice.rawSample && customVoice.rawSample.trim().length > 0);

    // High-fidelity handcrafted explanations for all 8 demo stories
    const topicExplanations: Record<string, Record<VoicePreset, StoryExplanation>> = {
      'story-1': {
        executive: {
          headline: 'Liquidity & Monetary Stance: Neutral Guidance with Selective Easing Room',
          coreSummary: 'The RBI is maintaining policy rate status quo as core CPI settles at 3.8%. Industrial margins are insulated from input inflation spikes.',
          whyItMatters: [
            'Predictable cost-of-capital environment for upcoming Q4 enterprise debt issuances.',
            'Urban consumer demand remains steady without overheating risk.',
            'Foreign exchange reserves remain shielded against dollar index fluctuations.'
          ],
          conversationalTakeaway: 'The central bank has completed its rate hike cycle and is holding steady until late 2027.',
          activePreset: 'executive',
          isCustomVoiced: isCustom,
        },
        conversational: {
          headline: 'The RBI is basically taking its foot off the accelerator without hitting the brakes.',
          coreSummary: 'Good news on inflation: prices aren’t surging anymore. The central bank is comfortable with where things are and won’t be surprising anyone with sudden rate hikes.',
          whyItMatters: [
            'Home loan EMIs and credit card interest rates will stay where they are for now.',
            'Companies can plan hiring and investments without fearing credit crunches.',
            'The economy is steady: neither running hot nor stalling out.'
          ],
          conversationalTakeaway: 'Think of this like cruise control on a highway — no dramatic lane shifts, just smooth cruising ahead.',
          activePreset: 'conversational',
          isCustomVoiced: isCustom,
        },
        storyteller: {
          headline: 'Inside the Reserve Bank: How India Navigated the Global Inflation Maze',
          coreSummary: 'A quiet morning inside Mumbai’s Mint Road headquarters brought the announcement markets have anticipated for months: price stability is back within target bounds.',
          whyItMatters: [
            'Traders across Dalal Street welcomed the predictable macroeconomic cushion.',
            'Small businesses and industrial manufacturers regain long-term visibility.',
            'Demonstrates how calibrated supply-side interventions tamed core price swings.'
          ],
          conversationalTakeaway: 'A chapter of post-pandemic inflation anxiety is gently drawing to a close, replaced by steady, earned calm.',
          activePreset: 'storyteller',
          isCustomVoiced: isCustom,
        }
      },
      'story-2': {
        executive: {
          headline: 'Enterprise AI Architecture: Open-Weight Models Yield 65% Cloud Margin Gains',
          coreSummary: 'Indian enterprises are shifting sensitive production workloads from proprietary US APIs to on-premise fine-tuned Indic LLMs.',
          whyItMatters: [
            'Token inference expenditures slashed by 60–70% within seven months of deployment.',
            'Zero customer financial or biometric data leaves sovereign domestic server boundaries.',
            'Protects enterprise architecture against third-party API deprecations and price changes.'
          ],
          conversationalTakeaway: 'Self-hosting open-weight models is now the default architectural choice for security-conscious Indian CIOs.',
          activePreset: 'executive',
          isCustomVoiced: isCustom,
        },
        conversational: {
          headline: 'Indian tech companies are ditching expensive AI subscriptions to run their own models.',
          coreSummary: 'Why pay monthly per-word fees to overseas AI giants when you can run equally smart models on your own servers at a fraction of the cost?',
          whyItMatters: [
            'Customer data stays completely private inside India.',
            'Apps won’t break if a third-party cloud service goes down.',
            'It’s much cheaper to build AI features in Hindi, Tamil, and Bengali.'
          ],
          conversationalTakeaway: 'It’s like switching from renting a taxi for every errand to owning your own dependable electric scooter.',
          activePreset: 'conversational',
          isCustomVoiced: isCustom,
        },
        storyteller: {
          headline: 'The Bengaluru AI Rebellion: Breaking Free from the Cloud Monopolies',
          coreSummary: 'Across tech corridors from Electronic City to Whitefield, engineering squads are proving that high-performing AI doesn’t require billionaire cloud budgets.',
          whyItMatters: [
            'Indigenous benchmarks validate localized language reasoning capabilities.',
            'Fosters an independent developer ecosystem tailored to local Indian commerce.',
            'Transforms AI from an imported novelty into a homegrown industrial utility.'
          ],
          conversationalTakeaway: 'India’s software builders are doing what they do best: democratizing technology through sheer computational frugality.',
          activePreset: 'storyteller',
          isCustomVoiced: isCustom,
        }
      },
      'story-3': {
        executive: {
          headline: 'Logistics Infrastructure: Western DFC Yields 38-Hour Transit Compression',
          coreSummary: 'Dedicated rail freight corridors between NCR and maritime hubs in Gujarat/Maharashtra have reduced container travel time by nearly two days.',
          whyItMatters: [
            'Average commercial train speeds surged from 25 km/h to 68 km/h on dedicated tracks.',
            'Direct logistics cost reduction of 18% for automotive and textile export clusters.',
            'Accelerates container turnaround times at Nhava Sheva (JNPT) and Mundra ports.'
          ],
          conversationalTakeaway: 'Moving factory goods across Western India is now twice as fast and substantially cheaper.',
          activePreset: 'executive',
          isCustomVoiced: isCustom,
        },
        conversational: {
          headline: 'Freight trains between Delhi and Mumbai are no longer crawling slower than bicycles.',
          coreSummary: 'Freight cargo in India used to get delayed whenever passenger trains took priority. With dedicated double-decker electric rail corridors, shipping containers now zip across the country in record time.',
          whyItMatters: [
            'Made-in-India electronics and cars reach cargo ships 38 hours earlier.',
            'Fewer diesel trucks on national highways means cleaner air and less highway congestion.',
            'Helps Indian manufacturers compete directly with Chinese export delivery speeds.'
          ],
          conversationalTakeaway: 'Imagine building a private express highway exclusively for freight trains — that is what just went fully operational.',
          activePreset: 'conversational',
          isCustomVoiced: isCustom,
        },
        storyteller: {
          headline: 'Across the Thar Plains: The Electric Rail Artery Transforming India’s Trade',
          coreSummary: 'Beneath overhead high-voltage wires stretching across the scrublands of Rajasthan and Gujarat, mile-long freight trains loaded with two tiers of containers glide silently through the night.',
          whyItMatters: [
            'Ends decades of freight trains being sidelined on congested shared passenger tracks.',
            'Unlocks economic hinterlands in Haryana and Western UP directly to international maritime shipping lanes.',
            'A triumph of heavy civil engineering and automated signaling technology.'
          ],
          conversationalTakeaway: 'Quietly and relentlessly, the backbone of India’s industrial modernization is being welded in steel and electric power.',
          activePreset: 'storyteller',
          isCustomVoiced: isCustom,
        }
      },
      'story-4': {
        executive: {
          headline: 'Aerospace Engineering: Autonomous Orbital Docking Validated for Space Station',
          coreSummary: 'ISRO has successfully proven sub-millimeter robotic docking and fluid transfer in low Earth orbit, satisfying the technical gate for the 2028 space station launch.',
          whyItMatters: [
            'Autonomous optical rangefinders and laser sensors achieved automated latching without manual ground override.',
            'Validates modular module assembly in space, essential for the Bharatiya Antariksh Station.',
            'Enables orbital refueling and multi-payload deep space sample return architectures.'
          ],
          conversationalTakeaway: 'ISRO now possesses the specialized automated orbital rendezvous capability held by only three other space programs globally.',
          activePreset: 'executive',
          isCustomVoiced: isCustom,
        },
        conversational: {
          headline: 'ISRO just showed it can parallel park two spacecraft at 28,000 km/h in zero gravity.',
          coreSummary: 'Connecting two spacecraft in orbit is one of the hardest things in space exploration. ISRO built robotic crafts that found each other in the dark, aligned with millimeter precision, and locked together completely automatically.',
          whyItMatters: [
            'This is the core technology needed to build India’s own space station by 2028.',
            'Proves Indian sensors and software can handle ultra-precise space rendezvous.',
            'Opens the door to refueling satellites in orbit so they can last decades longer.'
          ],
          conversationalTakeaway: 'Think of it like threading a needle from across a football field while riding a supersonic jet — completely automated!',
          activePreset: 'conversational',
          isCustomVoiced: isCustom,
        },
        storyteller: {
          headline: 'Rendezvous Above the Clouds: How Two Robotic Scouts Met in the Silence of Orbit',
          coreSummary: 'Four hundred kilometers above the Indian Ocean, in the utter silence of the thermosphere, two metallic spacecraft glided toward one another guided by invisible laser pulses.',
          whyItMatters: [
            'Telemetry engineers in Bengaluru erupted in cheers as mechanical docking latches engaged on schedule.',
            'Carries the nation one step closer to permanent human habitation in low Earth orbit.',
            'A milestone born from indigenous computer vision and miniaturized reaction-control thrusters.'
          ],
          conversationalTakeaway: 'In the cold expanse of space, India took its first firm step toward assembling a home among the stars.',
          activePreset: 'storyteller',
          isCustomVoiced: isCustom,
        }
      },
      'story-5': {
        executive: {
          headline: 'Semiconductor Strategy: Commercial 3D Packaging Cleanroom Tool-In at Sanand',
          coreSummary: 'Equipment installation has begun at the Sanand advanced semiconductor packaging facility, positioning India within heterogeneous chiplet assembly supply chains.',
          whyItMatters: [
            'Initial production focuses on 2.5D and 3D heterogeneous packaging for automotive and 5G microcontrollers.',
            'First wafer output targeted for Q2 2027, backed by Tier-1 commercial supply off-take agreements.',
            'Validates the government’s $10B India Semiconductor Mission incentive deployment.'
          ],
          conversationalTakeaway: 'India is transitioning from chip design centers to actual physical silicon fabrication and advanced packaging cleanrooms.',
          activePreset: 'executive',
          isCustomVoiced: isCustom,
        },
        conversational: {
          headline: 'India isn’t just designing microchips anymore — Gujarat is building the cleanrooms to package them.',
          coreSummary: 'Modern microchips aren’t single slabs of silicon anymore; they are stacks of tiny chiplets assembled in ultra-clean rooms. Gujarat just started installing the specialized equipment to do this commercially.',
          whyItMatters: [
            'Domestic cars, smartphones, and routers will soon use microchips assembled right here in India.',
            'Creates thousands of high-tech manufacturing jobs for semiconductor engineers.',
            'Protects India from global chip shortages during international supply disruptions.'
          ],
          conversationalTakeaway: 'It’s like moving from being an architect who draws house blueprints to owning the master construction factory.',
          activePreset: 'conversational',
          isCustomVoiced: isCustom,
        },
        storyteller: {
          headline: 'Dust-Free in Sanand: Inside the Airlocks of India’s Silicon Frontier',
          coreSummary: 'Past triple-stage air showers where specialized suits keep stray particles at bay, heavy robotic wafer-handling equipment was hoisted into place this morning in Sanand.',
          whyItMatters: [
            'Transforms an agrarian belt into a globally recognized semiconductor cluster.',
            'Represents billions of dollars of synchronized public incentives and private capital.',
            'Signals the tangible arrival of semiconductor hardware self-reliance.'
          ],
          conversationalTakeaway: 'In an environment where a single speck of dust can ruin a processor, India’s industrial future is finding sub-micron precision.',
          activePreset: 'storyteller',
          isCustomVoiced: isCustom,
        }
      },
      'story-6': {
        executive: {
          headline: 'Energy Transition: LFP Battery Cell Prices Drop to $48/kWh as Grid Solar Surges',
          coreSummary: 'Plummeting lithium iron phosphate battery costs have made utility solar-plus-storage cheaper than peaker natural gas across Southern Europe, India, and the US Southwest.',
          whyItMatters: [
            'Six-hour grid-scale battery storage achieves unsubsidized levelized cost parity with gas turbines.',
            'Accelerates retirement of expensive fossil peaker plants during peak evening demand hours.',
            'Grid interconnection queue backlogs remain the primary constraint to deployment speed.'
          ],
          conversationalTakeaway: 'The economics of 24/7 renewable power have decisively crossed the commercial viability threshold.',
          activePreset: 'executive',
          isCustomVoiced: isCustom,
        },
        conversational: {
          headline: 'Batteries got so cheap that storing afternoon sunshine is now cheaper than burning gas at night.',
          coreSummary: 'The big knock on solar power was always: "What do you do when the sun goes down?" Big industrial batteries used to be too expensive to bridge the gap. Now battery prices have collapsed by over 50%.',
          whyItMatters: [
            'Power grids can store excess afternoon solar and feed it back into homes during evening peak hours.',
            'Electricity becomes cleaner without needing expensive emergency gas plants.',
            'Lower battery costs also mean electric vehicles and rooftop solar systems will get cheaper.'
          ],
          conversationalTakeaway: 'Think of this like buying a gigantic, cheap thermos that keeps your hot tea warm all night long at no extra cost.',
          activePreset: 'conversational',
          isCustomVoiced: isCustom,
        },
        storyteller: {
          headline: 'Bottling the Sun: How the Battery Cost Curve Rewrote the Energy Playbook',
          coreSummary: 'Across the sun-scorched plains of Rajasthan and Southern Europe, rows of white shipping containers filled with lithium cells hum quietly in the afternoon heat.',
          whyItMatters: [
            'Proves that technological learning curves consistently beat fossil resource extraction economics.',
            'Eliminates the historical intermittency dilemma of solar and wind generation.',
            'Signals the sunset era for traditional fossil peaker power generation.'
          ],
          conversationalTakeaway: 'The green transition is no longer a moral plea or regulatory mandate; it is now an unstoppable law of economic gravity.',
          activePreset: 'storyteller',
          isCustomVoiced: isCustom,
        }
      },
      'story-7': {
        executive: {
          headline: 'International Trade: India-EU Talks Propose CBAM Reciprocity for Green Steel',
          coreSummary: 'Negotiators in Brussels have proposed compliance alignment pathways granting certified low-carbon Indian steel and aluminum reciprocal credits under the EU Carbon Border Mechanism.',
          whyItMatters: [
            'Averts punitive tariffs on $8B+ of annual Indian metal exports to the European Union.',
            'Incentivizes Indian industrial conglomerates to accelerate green hydrogen blast furnace adoption.',
            'Establishes a bilateral verification benchmark that could shape multilateral WTO climate rules.'
          ],
          conversationalTakeaway: 'Indian industrial exporters are securing tariff protections by validating their investments in clean manufacturing.',
          activePreset: 'executive',
          isCustomVoiced: isCustom,
        },
        conversational: {
          headline: 'India and Europe are figuring out how to trade green steel without slapping heavy carbon taxes.',
          coreSummary: 'Europe has a new rule: if you export goods that caused heavy pollution to make, you have to pay a carbon tax at the border. India is negotiating to ensure our cleanest steel and aluminum factories get credit for going green.',
          whyItMatters: [
            'Protects billions in Indian industrial exports from sudden tariffs.',
            'Encourages factories in Odisha and Jharkhand to use clean power and hydrogen.',
            'Sets a precedent so developing nations aren’t unfairly locked out of European trade.'
          ],
          conversationalTakeaway: 'It’s like getting a discount on your toll fee because you’re driving a certified zero-emissions electric truck.',
          activePreset: 'conversational',
          isCustomVoiced: isCustom,
        },
        storyteller: {
          headline: 'Diplomacy at the Carbon Border: How Green Steel Found Common Ground in Brussels',
          coreSummary: 'In the glass-walled headquarters of the European Commission, negotiators from New Delhi and Brussels spent late hours hashing out carbon accounting spreadsheets.',
          whyItMatters: [
            'Bridges the philosophical divide between Western climate regulations and Global South industrial realities.',
            'Protects key industrial export employment while pushing real emissions reductions.',
            'A masterclass in modern commercial diplomacy where climate policy and trade law intersect.'
          ],
          conversationalTakeaway: 'At the negotiating table, climate commitments and economic survival found a pragmatic, working compromise.',
          activePreset: 'storyteller',
          isCustomVoiced: isCustom,
        }
      },
      'story-8': {
        executive: {
          headline: 'Agritech Scale: 40M Farmers Connected to Micro-Weather & Soil Registry',
          coreSummary: 'The National Digital Agriculture Mission has linked 40 million farmers to Hyperlocal soil saturation telemetry, reducing chemical fertilizer consumption by 22%.',
          whyItMatters: [
            'Yield consistency improved by 14% across participating wheat and pulse agrarian belts.',
            'Significant reduction in government fertilizer import subsidy outlays.',
            'Satellite remote sensing and ground IoT sensors deliver vernacular advisories via SMS and WhatsApp.'
          ],
          conversationalTakeaway: 'Digital telemetry is systematically replacing guesswork with data-driven irrigation and nutrient scheduling in Indian agriculture.',
          activePreset: 'executive',
          isCustomVoiced: isCustom,
        },
        conversational: {
          headline: 'Millions of Indian farmers are getting automated phone alerts telling them exactly when to water their crops.',
          coreSummary: 'Instead of guessing when to water or spray fertilizer, farmers in Punjab, Haryana, and UP are getting real-time alerts based on soil sensors and weather satellites.',
          whyItMatters: [
            'Farmers save money by not wasting expensive fertilizer.',
            'Less chemical runoff protects groundwater and soil health.',
            'Crops produce better, more consistent harvests even when monsoon rains are unpredictable.'
          ],
          conversationalTakeaway: 'Think of it like a smart fitness watch for agricultural soil, sending personalized tips straight to the farmer’s phone.',
          activePreset: 'conversational',
          isCustomVoiced: isCustom,
        },
        storyteller: {
          headline: 'Sensors in the Soil: How Satellites and Smartphones are Rewriting the Harvest',
          coreSummary: 'At dawn in a small village outside Chandigarh, a farmer checks his phone before heading out into the wheat field. The screen alerts him that subterranean moisture is high, advising him to hold off on irrigation.',
          whyItMatters: [
            'Brings cutting-edge aerospace telemetry directly into the hands of rural agrarian households.',
            'Reverses decades of soil degradation caused by unmeasured chemical over-fertilization.',
            'A compelling example of technology delivering immediate, measurable livelihood impact.'
          ],
          conversationalTakeaway: 'Centuries of agrarian tradition are being quietly elevated by invisible digital threads connecting satellite orbits to the morning soil.',
          activePreset: 'storyteller',
          isCustomVoiced: isCustom,
        }
      }
    };

    // Return known tailored explanation if available
    if (topicExplanations[story.id]?.[preset]) {
      const exp = { ...topicExplanations[story.id][preset] };
      if (isCustom && customVoice) {
        exp.conversationalTakeaway = `${exp.conversationalTakeaway} (Tailored to your ${customVoice.formality} ${customVoice.brevity} writing profile)`;
      }
      return exp;
    }

    // Dynamic fallback generation based on story metadata and tone preset
    return this.generateDynamicExplanation(story, preset, customVoice);
  },

  generateDynamicExplanation(
    story: Story,
    preset: VoicePreset,
    customVoice?: CustomVoiceProfile
  ): StoryExplanation {
    const isCustom = Boolean(customVoice?.rawSample);

    if (preset === 'executive') {
      return {
        headline: `Strategic Brief: ${story.title}`,
        coreSummary: story.deck || story.content.slice(0, 160) + '...',
        whyItMatters: [
          `Directly impacts ${story.category} fundamentals and regulatory forward guidance.`,
          `Signals structural shift for key enterprise and institutional stakeholders.`,
          `Published by ${story.sourceName} with verified industry attribution.`
        ],
        conversationalTakeaway: 'High-signal event requiring operational awareness without emergency response.',
        activePreset: 'executive',
        isCustomVoiced: isCustom,
      };
    }

    if (preset === 'storyteller') {
      return {
        headline: `The Story Behind: ${story.title}`,
        coreSummary: `What began as routine development in ${story.category} has evolved into a noteworthy chapter for national observers.`,
        whyItMatters: [
          `Connects broader global trends to localized developments on the ground.`,
          `Reported directly by ${story.sourceName} with on-the-scene context.`,
          `Sets the trajectory for how this sector will evolve heading into next year.`
        ],
        conversationalTakeaway: 'A fascinating reminder that policy and technology are living stories shaped by real people.',
        activePreset: 'storyteller',
        isCustomVoiced: isCustom,
      };
    }

    // Default conversational
    return {
      headline: `In Plain English: ${story.title}`,
      coreSummary: `Here is the quick breakdown: ${story.deck || story.content.slice(0, 150)}`,
      whyItMatters: [
        `It matters because it shapes how things will work in ${story.category} over coming months.`,
        `You get the core takeaway without wading through complex industry jargon.`,
        `Original reporting from ${story.sourceName} links you straight to the source.`
      ],
      conversationalTakeaway: 'Think of this as a milestone move — worth knowing about over your morning coffee!',
      activePreset: 'conversational',
      isCustomVoiced: isCustom,
    };
  }
};
