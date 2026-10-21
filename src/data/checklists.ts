/**
 * Preparedness guidance content.
 *
 * ⚠️ This is GENERIC, non-location-specific safety information written for the
 * prototype. It is not official guidance for any real place, and local
 * emergency authorities always take precedence over anything stated here.
 */

import type { ChecklistSection } from '../types'

export const CHECKLIST_SECTIONS: ChecklistSection[] = [
  {
    id: 'before',
    title: 'Before a flood',
    summary:
      'Generic preparedness principles. Local emergency authorities always take precedence over anything shown here.',
    items: [
      {
        id: 'b1',
        label: 'Identify your official local warning channels',
        description:
          'Know which government weather service, local authority and emergency broadcast channel your area actually uses.',
      },
      {
        id: 'b2',
        label: 'Map at least two safe evacuation routes',
        description:
          'Choose routes that move you to higher ground and avoid known low crossings, bridges and underpasses.',
      },
      {
        id: 'b3',
        label: 'Assemble an emergency kit',
        description:
          'Water, food, medicines, torch, power bank, radio, first aid kit, protective clothing and copies of key documents.',
      },
      {
        id: 'b4',
        label: 'Protect and back up important documents',
        description:
          'Keep identification, insurance and property records in a waterproof bag plus a secure digital copy.',
      },
      {
        id: 'b5',
        label: 'Plan for family members who may need assistance',
        description:
          'Agree a contact plan for children, older adults, people with disabilities and anyone without transport.',
      },
      {
        id: 'b6',
        label: 'Move vehicles, valuables and livestock to higher ground',
        description:
          'Relocate what you can before conditions deteriorate, and never attempt this once flooding has started.',
      },
    ],
  },
  {
    id: 'during',
    title: 'During a flood',
    summary:
      'General life-safety guidance only. Always follow instructions issued by your local emergency authorities.',
    items: [
      {
        id: 'd1',
        label: 'Follow instructions from local authorities',
        description:
          'Official evacuation orders and warnings take precedence over any information in this demonstration interface.',
      },
      {
        id: 'd2',
        label: 'Move to safer ground when instructed',
        description:
          'Leave early, travel on foot to higher ground if you can, and tell someone your intended route.',
      },
      {
        id: 'd3',
        label: 'Never walk or drive through floodwater',
        description:
          'Water depth is hard to judge and moving water can sweep away a person or a vehicle in seconds.',
      },
      {
        id: 'd4',
        label: 'Keep away from electrical hazards',
        description:
          'Do not touch downed power lines, flooded electrical equipment or pumps that are plugged in.',
      },
      {
        id: 'd5',
        label: 'Do not enter flooded buildings',
        description:
          'Structural damage, concealed currents and contaminated water make entry extremely dangerous.',
      },
      {
        id: 'd6',
        label: 'Keep an emergency kit and communication device to hand',
        description:
          'Carry a torch, charged phone, whistle and small first aid kit when you move to higher ground.',
      },
    ],
  },
  {
    id: 'after',
    title: 'After a flood',
    summary:
      'Recovery guidance is general in nature. Official health and relief authorities must confirm local conditions.',
    items: [
      {
        id: 'a1',
        label: 'Avoid contaminated floodwater',
        description:
          'Floodwater can carry sewage, chemicals, bacteria and sharp debris. Wash cuts and cover them properly.',
      },
      {
        id: 'a2',
        label: 'Check for electrical and structural hazards',
        description:
          'Assume power is unsafe until the utility confirms otherwise, and avoid weakened walls, ceilings and floors.',
      },
      {
        id: 'a3',
        label: 'Wait for official guidance before returning home',
        description:
          'Authorities may keep an area closed because of water quality, structural damage or rescue operations.',
      },
      {
        id: 'a4',
        label: 'Document damage only when it is safe to do so',
        description:
          'Photograph from a safe position, keep receipts, and never enter a property to retrieve belongings.',
      },
      {
        id: 'a5',
        label: 'Follow official health and relief information',
        description:
          'Use sanitised water, follow boiling instructions, and rely on official advisories for clean-up and aid.',
      },
      {
        id: 'a6',
        label: 'Clean and disinfect safely',
        description:
          'Wear gloves and boots, ventilate rooms, dry materials quickly and discard items that cannot be cleaned.',
      },
    ],
  },
]

export const EMERGENCY_KIT_ITEMS = [
  {
    id: 'k1',
    label: 'Drinking water (at least 3 litres per person per day)',
    description: 'Sealed containers plus a manual water filter if available.',
  },
  {
    id: 'k2',
    label: 'Non-perishable, ready-to-eat food',
    description: 'Enough for at least three days per person.',
  },
  {
    id: 'k3',
    label: 'Torch and spare batteries',
    description: 'A hand-crank or wind-up torch is more useful than batteries alone.',
  },
  {
    id: 'k4',
    label: 'Power bank and charging cables',
    description: 'Keep devices charged for receiving official updates.',
  },
  {
    id: 'k5',
    label: 'Battery or hand-crank radio',
    description: 'For official broadcasts when the mobile network is down.',
  },
  {
    id: 'k6',
    label: 'First aid kit and essential medicines',
    description: 'Include prescription medication and a small hygiene pack.',
  },
  {
    id: 'k7',
    label: 'Protective clothing and sturdy footwear',
    description: 'Waterproof layers and boots that can be worn in contaminated water.',
  },
  {
    id: 'k8',
    label: 'Waterproof document pouch',
    description: 'Identification, insurance, property and medical documents in a sealed bag.',
  },
  {
    id: 'k9',
    label: 'Whistle and high-visibility vest',
    description: 'For signalling rescuers and remaining visible during evacuation.',
  },
  {
    id: 'k10',
    label: 'Emergency contact and evacuation plan card',
    description: 'Written, laminated, and kept with the kit rather than only on a phone.',
  },
]
