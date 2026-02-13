import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import AdminLayout from "../components/AdminLayout";
import ConfiguracoesTextos from "../pages/ConfiguracoesTextos";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/AdminLayout">
                <AdminLayout/>
            </ComponentPreview>
            <ComponentPreview path="/ConfiguracoesTextos">
                <ConfiguracoesTextos/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews