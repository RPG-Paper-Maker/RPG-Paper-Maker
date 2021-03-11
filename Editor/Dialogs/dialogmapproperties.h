/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    DialogMapProperties(MapProperties& properties, QWidget *parent = nullptr);
    ~DialogMapProperties();

private:
    Ui::DialogMapProperties *ui;
    MapProperties& m_mapProperties;

    void initialize();
    void translate();

private slots:
    void on_spinBoxLength_valueChanged(int i);
    void on_spinBoxWidth_valueChanged(int i);
    void on_spinBoxHeight_valueChanged(int i);
    void on_spinBoxDepth_valueChanged(int i);
    void on_comboBoxTilesetCurrentIndexChanged(int index);
    void on_radioButtonColor_toggled(bool checked);
    void on_radioButtonPicture_toggled(bool checked);
    void on_radioButtonSkybox_toggled(bool checked);
    void on_treeViewRandomBattlesNeedsUpdateJson(SuperListItem *);
};

#endif // DIALOGMAPPROPERTIES_H
