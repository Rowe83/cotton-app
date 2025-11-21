export default function Footer() {
    return (
      <footer className="bg-card border-t border-border py-8 mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <h4 className="font-bold text-foreground mb-3">产品</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition">
                    实时价格
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    市场分析
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    价格预测
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-3">帮助</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition">
                    使用指南
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    常见问题
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    联系我们
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-3">法律</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition">
                    隐私政策
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    服务条款
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    免责声明
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-3">关于</h4>
              <p className="text-sm text-muted-foreground">
                专业的新疆棉花市场分析平台，为农民提供实时、准确的市场数据和决策支持。
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-6">
            <p className="text-center text-sm text-muted-foreground">© 2025 新疆棉花市场分析平台。保留所有权利。</p>
          </div>
        </div>
      </footer>
    )
  }
  