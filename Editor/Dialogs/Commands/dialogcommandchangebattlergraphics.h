/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCHANGEBATTLERGRAPHICS_H
#define DIALOGCOMMANDCHANGEBATTLERGRAPHICS_H

#include "dialogcommand.h"
#include "primitivevalue.h"

namespace Ui {
class DialogCommandChangeBattlerGraphics;
}

class DialogCommandChangeBattlerGraphics : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandChangeBattlerGraphics(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters
        = nullptr, QStandardItemModel *troopMonstersList = nullptr, QWidget
        *parent = nullptr);
    virtual ~DialogCommandChangeBattlerGraphics();

    void initializePrimitives();
    void translate();

    virtual EventCommand * getCommand() const;
    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandChangeBattlerGraphics *ui;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
    QStandardItemModel *m_troopMonstersList;
    PrimitiveValue *m_facesetID;
    PrimitiveValue *m_battlerID;

public slots:
    void on_radioButtonEnemy_toggled(bool checked);
    void on_radioButtonHeroEnemyInstanceID_toggled(bool checked);
    void on_checkBoxFaceset_toggled(bool checked);
    void on_checkBoxBattler_toggled(bool checked);
};

#endif // DIALOGCOMMANDCHANGEBATTLERGRAPHICS_H
