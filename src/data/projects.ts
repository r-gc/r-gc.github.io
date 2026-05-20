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
		summary: "AI 食谱与内容生成应用。",
		description:
			"围绕食谱生成、内容组织和交互体验展开的 AI 应用项目。后续会补充具体功能、技术栈、截图和部署地址。",
		status: "整理中",
		featured: true,
		tags: ["AI", "Web App", "Recipe"],
		highlights: [
			"适合作为 AI 应用方向的重点展示项目",
			"后续可补充生成逻辑、提示词设计和用户流程",
			"可以扩展为项目复盘文章和在线演示",
		],
	},
	{
		title: "Frappe / ERPNext Docker 实践",
		slug: "frappe-erpnext-docker",
		summary: "基于 Frappe Docker 的业务系统开发、前端集成和接口测试实践。",
		description:
			"围绕 Frappe / ERPNext 容器化环境进行业务系统开发，包含 myapp 后端模块、Web 前端、移动端、Postman 接口集合、HTTP 测试与性能基线记录。",
		status: "进行中",
		featured: true,
		tags: ["Frappe", "ERPNext", "Docker", "React Native", "API"],
		repoUrl: "https://github.com/rgc318/frappe_docker",
		articleUrl: "/posts/project-frappe-erpnext-myapp/",
		highlights: [
			"在 Docker 化 Frappe 环境中开发自定义业务应用",
			"包含 apps/myapp、frontend/myapp-web、frontend/myapp-mobile 等模块",
			"整理了接口测试集合、HTTP 测试结果和性能基线记录",
		],
	},
	{
		title: "RGC Blog",
		slug: "rgc-blog",
		summary: "基于 Astro、Fuwari 和 Cloudflare Workers 的个人博客。",
		description:
			"用于沉淀技术文章、项目复盘、学习笔记和 Web 实验的个人站点。代码托管在 GitHub，主部署走 Cloudflare Workers Static Assets。",
		status: "进行中",
		featured: true,
		tags: ["Astro", "Fuwari", "Cloudflare", "Blog"],
		repoUrl: "https://github.com/r-gc/r-gc.github.io",
		demoUrl: "https://blog.rgcdev.top/",
		articleUrl: "/posts/project-rgc-blog-architecture/",
		highlights: [
			"使用 Astro 静态生成和 Fuwari 博客主题",
			"部署到 Cloudflare Workers，并保留 GitHub Pages 作为备用",
			"规划了项目、笔记、实验室等长期内容结构",
		],
	},
	{
		title: "零信任系统",
		slug: "zero-trust-system",
		summary: "围绕零信任访问控制与安全策略的系统项目。",
		description:
			"用于论文、答辩和系统实现整理的安全方向项目。后续可补充架构图、ER 图、核心功能、部署方式和演示截图。",
		status: "整理中",
		featured: true,
		tags: ["Zero Trust", "Security", "Architecture"],
		articleUrl: "/posts/project-zerotrust-access-control/",
		highlights: [
			"包含 Flask 后端、Vue 前端、MySQL、SDN 控制器和 Docker Compose 编排",
			"覆盖用户、资源、策略、审计、监控与 SDN 流表下发演示",
			"提供接口级验收测试，适合答辩和项目复盘展示",
		],
	},
	{
		title: "WMS System",
		slug: "wms-system",
		summary: "仓储管理系统相关实践项目。",
		description:
			"用于整理仓储管理系统的功能模块、业务流程、数据建模和实现经验。后续可补充具体技术栈和页面截图。",
		status: "整理中",
		featured: false,
		tags: ["WMS", "Management System", "Business"],
		highlights: [
			"适合展示业务系统建模和模块拆分能力",
			"后续可补充入库、出库、库存、权限等业务流程",
			"可以扩展为项目复盘文章",
		],
	},
];
