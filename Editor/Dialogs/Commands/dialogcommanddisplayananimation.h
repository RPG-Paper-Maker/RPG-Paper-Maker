/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDDISPLAYANANIMATION_H
#define DIALOGCOMMANDDISPLAYANANIMATION_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandDisplayAnAnimation
//
//  A dialog used for displaying an animation in HUD.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandDisplayAnAnimation;
}

class DialogCommandDisplayAnAnimation : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandDisplayAnAnimation(EventCommand *command = nullptr,
        SystemCommonObject *object = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    ~DialogCommandDisplayAnAnimation();

    virtual EventCommand * getCommand() const;

protected:
    SystemCommonObject *m_object;
    QStandardItemModel *m_parameters;
    QStandardItemModel *m_modelObjects;

    void initializePrimitives();
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandDisplayAnAnimation *ui;

    void translate();
};

#endif // DIALOGCOMMANDDISPLAYANANIMATION_H
