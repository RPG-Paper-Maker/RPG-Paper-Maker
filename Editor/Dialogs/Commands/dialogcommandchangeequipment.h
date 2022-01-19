/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCHANGEEQUIPMENT_H
#define DIALOGCOMMANDCHANGEEQUIPMENT_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandChangeEquipment
//
//  A dialog used for changing equipment of an ally / enemy.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandChangeEquipment;
}

class DialogCommandChangeEquipment : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandChangeEquipment(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    ~DialogCommandChangeEquipment();

    virtual EventCommand * getCommand() const;

protected:
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
    QStandardItemModel *m_weaponsArmors;

    void initializePrimitives();
    void updateWeaponsArmors(int id);

    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandChangeEquipment *ui;

    void translate();

public slots:
    void onPanelPrimitiveEquipmentID_numberUpdated(int id);
    void on_comboBoxWeaponArmor_currentIndexChanged(int);
};

#endif // DIALOGCOMMANDCHANGEEQUIPMENT_H
