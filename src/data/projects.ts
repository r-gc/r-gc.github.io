export type ProjectStatus = "进行中" | "已完成" | "整理中" | "计划中";

export type Project = {
	title: string;
	slug: string;
	summary: string;
	description: string;
	status: ProjectStatus;
	featured: boolean;
	tags: string[];
	repoUrl?: string;
	demoUrl?: string;
	articleUrl?: string;
	highlights: string[];
};

export const projects: Project[] = [
	{
		title: "AI Recipe",
		slug: "ai-recipe",
		summary: "一个关于食谱、内容生成和 AI 工作流的小项目。",
		description:
			"这个坑还在整理中。大方向是把 AI 生成能力放进一个具体场景里：不是只让模型回答问题，而是让它参与内容组织、生成流程和用户交互。",
		status: "整理中",
		featured: true,
		tags: ["AI", "Web App", "Recipe"],
		highlights: [
			"之后会补一篇完整的思路记录",
			"重点会放在提示词、生成流程和产品交互",
			"如果整理顺利，会做成可以在线体验的 demo",
		],
	},
	{
		title: "Frappe / ERPNext Docker 实践",
		slug: "frappe-erpnext-docker",
		summary: "把 Frappe / ERPNext 跑起来之后，继续往业务系统方向推进的一组实践。",
		description:
			"这里记录的不是一次简单安装，而是围绕 `myapp` 做出的后端接口、Web 端、移动端和测试整理。它更像一个长期实验场：用 ERPNext 的底座，去验证业务网关、移动作业和接口回归应该怎样组织。",
		status: "进行中",
		featured: true,
		tags: ["Frappe", "ERPNext", "Docker", "React Native", "API"],
		repoUrl: "https://github.com/rgc318/frappe_docker",
		articleUrl: "/posts/project-frappe-erpnext-myapp/",
		highlights: [
			"后端有自定义 Frappe App 和业务网关",
			"前端同时保留 Web 管理端和移动端方向",
			"文档里已经沉淀了接口测试、HTTP 回归和性能基线",
		],
	},
	{
		title: "RGC Blog",
		slug: "rgc-blog",
		summary: "这个站点本身，也会作为一个长期维护的小项目记录下来。",
		description:
			"博客不是一次搭完就结束的东西。这里会记录它从选型、部署、栏目规划到后续动画、音乐、视频实验的变化过程。",
		status: "进行中",
		featured: true,
		tags: ["Astro", "Fuwari", "Cloudflare", "Blog"],
		repoUrl: "https://github.com/r-gc/r-gc.github.io",
		demoUrl: "https://blog.rgcdev.top/",
		articleUrl: "/posts/project-rgc-blog-architecture/",
		highlights: [
			"Astro 负责内容和静态生成",
			"Fuwari 提供博客基础体验",
			"Cloudflare Workers 是当前主部署，GitHub Pages 作为备用",
		],
	},
	{
		title: "WMS System",
		slug: "wms-system",
		summary: "仓储管理方向的内容先放在这里，等资料确认后再展开。",
		description:
			"这个条目暂时只作为占位。后面如果继续整理，会优先写清楚入库、出库、库存、权限和数据建模这些真正值得回看的部分。",
		status: "整理中",
		featured: false,
		tags: ["WMS", "Management System", "Business"],
		highlights: [
			"先确认项目资料和代码来源",
			"再补业务流程、页面截图和技术细节",
			"不急着写成展示页，先保证内容准确",
		],
	},
];
