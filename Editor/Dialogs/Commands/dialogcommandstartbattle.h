/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDSTARTBATTLE_H
#define DIALOGCOMMANDSTARTBATTLE_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandStartBattle
//
//  A dialog used for starting a battle.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandStartBattle;
}

class DialogCommandStartBattle : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandStartBattle(EventCommand *command = nullptr,
                                      SystemCommonObject *object = nullptr,
                                      QStandardItemModel *parameters = nullptr,
                                      QWidget *parent = nullptr);
    virtual ~DialogCommandStartBattle();
    EventCommand* getCommand() const;

protected:
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandStartBattle *ui;
    SystemCommonObject* m_object;
    QStandardItemModel* m_parameters;

    void translate();

private slots:
    void on_radioButtonVariableConstant_toggled(bool checked);
    void on_radioButtonID_toggled(bool checked);
    void on_radioButtonSelect_toggled(bool checked);
    void on_radioButtonNumber_toggled(bool checked);
    void on_comboBoxTransitionStart_currentIndexChanged(int index);
    void on_comboBoxTransitionEnd_currentIndexChanged(int index);
};

#endif // DIALOGCOMMANDSTARTBATTLE_H
