import './campaign.css';
import '../primer.css';
import UnnycPathCards from '@/components/unnyc/primer/UnnycPathCards';
import { getContent } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata() {
    const { meta } = getContent('campaign');
    return pageMetadata(meta, '/campaign', 'website');
}

/**
 * /campaign — the campaign's entry point. Two paths: sign the public open
 * letter (/campaign/sign), or formally endorse the Principles
 * (/campaign/endorse).
 *
 * ALL COPY LIVES IN content/campaign.md. See docs/EDITING-CONTENT.md.
 */
export default function CampaignChooserPage() {
    const doc = getContent('campaign');

    return (
        <div className="unnyc-cmp">
            <header className="unnyc-cmp-chooser__header">
                <div className="unnyc-container">
                    <h1 className="unnyc-cmp-chooser__title">{doc.title}</h1>
                    <p className="unnyc-cmp-chooser__lede">{doc.lede}</p>
                </div>
            </header>

            <UnnycPathCards paths={doc.paths} />
        </div>
    );
}
