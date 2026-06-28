import useWebInfo from "../data/useWebInfo";

function TopBanner() {
    const { webInfo } = useWebInfo();

    if (!webInfo?.top_banner_ad_content) return null;

    return (
        <div style={{
            background: '#111',
            color: '#fff',
            textAlign: 'center',
            padding: '9px 16px',
            fontSize: '12px',
            letterSpacing: '0.04em',
            fontWeight: 500,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
        }}>
            {webInfo.top_banner_ad_content}
        </div>
    );
}

export default TopBanner;
