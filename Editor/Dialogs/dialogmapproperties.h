/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
};

#endif // DIALOGMAPPROPERTIES_H
