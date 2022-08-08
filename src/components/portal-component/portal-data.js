// Copyright (C) 2022 Léo Gorman
//
// This file is part of rhomis-data-app.
//
// rhomis-data-app is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// rhomis-data-app is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with rhomis-data-app.  If not, see <http://www.gnu.org/licenses/>.

import { RiSurveyFill } from 'react-icons/ri'
import { VscInspect } from 'react-icons/vsc'
import { FcAcceptDatabase } from 'react-icons/fc'
import { FiDatabase } from 'react-icons/fi'
import { MdHelpOutline, MdOutlineDashboardCustomize, MdOutlineSendToMobile, MdOutlineCreate } from 'react-icons/md'
export const PortalDataAll = [
    {
        name: "Build a Survey",
        label: "surveyBuilder",
        text: "Get started straight away. Build a survey, collect test-data, and view your data.",
        icon: RiSurveyFill,
        link: process.env.REACT_APP_SURVEY_BUILDER_URL,
        external: true,
    },
    {
        name: "Manage Existing Projects",
        label: "projectManager",
        text: "Check up on your projects, download your data, and control user access.",
        icon: MdOutlineDashboardCustomize,
        link: "/projects",
        external: false,

    },

    // {
    //     name: "Collect Data",
    //     label: "dataCollector",
    //     text: "Collect data for an existing project and access enumerator training materials",
    //     icon: MdOutlineSendToMobile,
    //     link: "/projects",
    //     external: false,


    // },
    {
        name: "Global Dataset",
        label: "globalData",
        text: "Query publicly available survey data by time, location, and content.",
        icon: FiDatabase,
        link: "https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/9M6EHS",
        external: true,


    },
    {
        name: "Help",
        label: "help",
        text: "See guidance for more advanced use case and how to contribute to our system",
        icon: MdHelpOutline,
        link: "https://l-gorman.github.io/rhomis-docs/source/user-guide/first-time-user.html#rhomis-portal",
        external: true,
    },
    {
        name: "Administration",
        label: "administrator",
        text: "Create projects and forms (only used for development)",
        icon: MdOutlineCreate,
        link: "/administration",
        external: false,
    }
]

