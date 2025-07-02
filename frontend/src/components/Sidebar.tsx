'use client';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

type SidebarProps = {
    selected: string[];
    onChange: (category: string, checked: boolean) => void;
};

export default function Sidebar({ selected, onChange }: SidebarProps) {
    return (
        <div className="h-screen w-56 bg-amber-500 flex flex-col items-start p-4">
            <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Kategori</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selected.includes('Elektronik')}
                                onChange={(e) => onChange('Elektronik', e.target.checked)}
                            />
                        }
                        label="Elektronik"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selected.includes('Kitap')}
                                onChange={(e) => onChange('Kitap', e.target.checked)}
                            />
                        }
                        label="Kitaplar"
                    />
                </FormGroup>
            </FormControl>
        </div>
    );
}
