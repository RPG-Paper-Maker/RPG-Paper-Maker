/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCHANGEVARIABLES_H
#define DIALOGCOMMANDCHANGEVARIABLES_H

#include <QVector>
#include "dialogcommand.h"
#include "variablesdatas.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandChangeVariables
//
//  A dialog used for changing one or several variables values.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandChangeVariables;
}

class DialogCommandChangeVariables : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandChangeVariables(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr, QStandardItemModel *troopMonstersList = nullptr, QWidget *parent =
        nullptr);
    virtual ~DialogCommandChangeVariables();

    void initializePrimitives();
    void translate();

    virtual EventCommand * getCommand() const;
    virtual void initialize(EventCommand *command);

protected:
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
    QStandardItemModel *m_troopMonstersList;
    QStandardItemModel *m_modelObjects;

private:
    Ui::DialogCommandChangeVariables *ui;

private slots:
    void on_radioButtonOneVariable_toggled(bool checked);
    void on_radioButtonRange_toggled(bool checked);
    void on_radioButtonNumber_toggled(bool checked);
    void on_radioButtonRandom_toggled(bool checked);
    void on_radioButtonMessage_toggled(bool checked);
    void on_radioButtonSwitch_toggled(bool checked);
    void on_radioButtonNumberItem_toggled(bool checked);
    void on_radioButtonTotalCurrency_toggled(bool checked);
    void on_radioButtonNumberStat_toggled(bool checked);
    void on_radioButtonObjectInMap_toggled(bool checked);
    void on_radioButtonEnemy_toggled(bool checked);
    void on_radioButtonOtherCharacteristics_toggled(bool checked);
    void on_comboBoxNumberItem_currentIndexChanged(int index);
};

#endif // DIALOGCOMMANDCHANGEVARIABLES_H
