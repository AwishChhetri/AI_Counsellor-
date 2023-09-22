const normal = [
    { role: 'system', content: 'You are a supportive assistant.' },
    { role: 'user', content: `I've been feeling a bit down lately. Can you provide some advice for managing low mood?` },
    { role: 'assistant', content: `I'm here to help. Here are some suggestions that might assist you in managing low mood:` },
    { role: 'assistant', content: `1. Take deep breaths.`},
    { role: 'assistant', content: `2. Go have a walk outdoor or go catch some freash air!`},
    { role: 'assistant', content: `3. Try doing meditation regularly`},
    { role: 'assistant', content: `You are feeling perfectly alright! Dont worry, everything will be fine.`}
];


const slightly_mild = [
    { role: 'system', content: 'You are a supportive assistant.' },
    { role: 'user', content: `I've been feeling a bit anxious recently. Can you provide some advice for managing low mood?` },
    { role: 'assistant', content: `I'm here to help. Here are some suggestions that might assist you in managing low mood:` },
    { role: 'assistant', content: `Take some time for introspection`},
    { role: 'assistant', content: `Reflect on your emotions, thoughts, and behaviors to better understand what you're experiencing.`},
    { role: 'assistant', content: `Incorporate regular exercise, a balanced diet, and proper sleep into your routine. `},
    { role: 'assistant', content: `Practice mindfulness, deep breathing exercises, or meditation to reduce stress and build emotional resilience. `},
    { role: 'assistant', content: `You are feeling perfectly alright! Dont worry, everything will be fine.`}
];


const mild = [
    { role: 'system', content: 'You are a supportive assistant.' },
    { role: 'user', content: `I've been feeling a bit extreamly anxious recently. Can you provide some advice for managing low mood?` },
    { role: 'assistant', content: `I'm here to help. Here are some suggestions that might assist you in managing low mood:` },
    { role: 'assistant', content: `Consider engaging in therapy.`},
    { role: 'assistant', content: `Lean on your support system of friends and family for understanding and encouragement during your journey to recovery.`},
    { role: 'assistant', content: `Try meditating!`},
    { role: 'assistant', content: `You will feel perfectly alright! Dont worry, everything will be fine.`}
];




const slightly_extreme = [
    { role: 'system', content: 'You are a supportive assistant.' },
    { role: 'user', content: `I've been feeling a bit depressed recently. Can you provide some advice for managing low mood?` },
    { role: 'assistant', content: `I'm here to help. Here are some suggestions that might assist you in managing low mood:` },
    { role: 'assistant', content: `Reach out to a mental health specialist or psychiatrist without delay for a comprehensive evaluation.`},
    { role: 'assistant', content: `Engage in therapy with a qualified mental health professional. `},
    { role: 'assistant', content: `Prioritize self-care routines, encompassing physical exercise, a balanced diet, and restful sleep to support your mental well-being.`},
    { role: 'assistant', content: `You will feel perfectly alright! Dont worry, everything will be fine.`}
];


const extreme = [
    { role: 'system', content: 'You are a supportive assistant.' },
    { role: 'user', content: `I've been feeling a bit highly depressed recently. Can you provide some advice for managing low mood?` },
    { role: 'assistant', content: `I'm here to help. Here are some suggestions that might assist you in managing low mood:` },
    { role: 'assistant', content: `Without delay, seek the expertise of a mental health specialist or psychiatrist. `},
    { role: 'assistant', content: ` Engage in ongoing therapy with a qualified mental health professional. `},
    { role: 'assistant', content: `If prescribed by a healthcare provider, carefully follow medication recommendations to address specific symptoms effectively.`},
    { role: 'assistant', content: `You will feel perfectly alright! Dont worry, everything will be fine.`}
];