/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef DIALOGMAPPROPERTIES_H
#define DIALOGMAPPROPERTIES_H

#include <QDialog>
#include "mapproperties.h"

// -------------------------------------------------------
//
//  CLASS DialogMapProperties
//
//  A dialog used for configuring the properties of a map.
//
// -------------------------------------------------------

namespace Ui {
class DialogMapProperties;
}

class DialogMapProperties : public QDialog
{
    Q_OBJECT

public:
    DialogMapProperties(MapProperties& properties, QWidget *parent = 0);
    ~DialogMapProperties();

private:
    Ui::DialogMapProperties *ui;
    MapProperties& m_mapProperties;

    void initialize();

private slots:
    void on_spinBoxLength_valueChanged(int i);
    void on_spinBoxWidth_valueChanged(int i);
    void on_spinBoxHeight_valueChanged(int i);
    void on_spinBoxDepth_valueChanged(int i);
    void on_comboBoxTilesetCurrentIndexChanged(int index);
    void on_musicChanged();
    void on_backgroundSoundChanged();
};

#endif // DIALOGMAPPROPERTIES_H
