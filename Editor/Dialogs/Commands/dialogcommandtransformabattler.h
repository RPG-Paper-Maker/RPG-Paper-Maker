/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDTRANSFORMABATTLER_H
#define DIALOGCOMMANDTRANSFORMABATTLER_H

#include "dialogcommand.h"

namespace Ui {
class DialogCommandTransformABattler;
}

class DialogCommandTransformABattler : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandTransformABattler(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters
        = nullptr, QStandardItemModel *troopMonstersList = nullptr, QWidget
        *parent = nullptr);
    virtual ~DialogCommandTransformABattler();

    void initializePrimitives();
    void translate();

    virtual EventCommand * getCommand() const;
    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandTransformABattler *ui;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
    QStandardItemModel *m_troopMonstersList;

public slots:
    void on_radioButtonEnemy_toggled(bool checked);
    void on_radioButtonHeroEnemyInstanceID_toggled(bool checked);
};

#endif // DIALOGCOMMANDTRANSFORMABATTLER_H
