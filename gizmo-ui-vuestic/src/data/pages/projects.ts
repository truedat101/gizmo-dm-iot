import { sleep } from '../../services/utils'
import projectsDb from './projects-db.json'
import usersDb from './users-db.json'

// Simulate API calls
export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof (typeof projectsDb)[number] | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export const getProjects = async (options: Sorting & Pagination) => {
  await sleep(1000)

  const projects = projectsDb
    .slice((options.page - 1) * options.perPage, options.page * options.perPage)
    .map((project) => ({
      ...project,
      project_owner: usersDb.find((user) => user.id === project.project_owner)! as (typeof usersDb)[number],
      team: usersDb.filter((user) => project.team.includes(user.id)) as (typeof usersDb)[number][],
    }))

  if (options.sortBy && options.sortingOrder) {
    projects.sort((a, b) => {
      if (a[options.sortBy!] < b[options.sortBy!]) {
        return options.sortingOrder === 'asc' ? -1 : 1
      }
      if (a[options.sortBy!] > b[options.sortBy!]) {
        return options.sortingOrder === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  return {
    data: projects,
    pagination: {
      page: options.page,
      perPage: options.perPage,
      total: projectsDb.length,
    },
  }
}

export const addProject = async (project: Omit<(typeof projectsDb)[number], 'id' | 'creation_date'>) => {
  await sleep(1000)

  const newProject = {
    ...project,
    id: projectsDb.length + 1,
    creation_date: new Date().toLocaleDateString('gb', { day: 'numeric', month: 'short', year: 'numeric' }),
  }

  projectsDb.push(newProject)

  return {
    ...newProject,
    project_owner: usersDb.find((user) => user.id === project.project_owner)! as (typeof usersDb)[number],
    team: usersDb.filter((user) => project.team.includes(user.id)) as (typeof usersDb)[number][],
  }
}

export const updateProject = async (project: (typeof projectsDb)[number]) => {
  await sleep(1000)

  const index = projectsDb.findIndex((p) => p.id === project.id)
  projectsDb[index] = project

  return project
}

export const removeProject = async (project: (typeof projectsDb)[number]) => {
  await sleep(1000)

  const index = projectsDb.findIndex((p) => p.id === project.id)
  projectsDb.splice(index, 1)

  return project
}
