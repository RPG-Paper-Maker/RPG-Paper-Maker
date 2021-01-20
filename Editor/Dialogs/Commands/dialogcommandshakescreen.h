/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDSHAKESCREEN_H
#define DIALOGCOMMANDSHAKESCREEN_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandShakeScreen
//
//  A dialog used for shaking screen.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandShakeScreen;
}

class DialogCommandShakeScreen : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandShakeScreen(EventCommand *command = nullptr,
        SystemCommonObject *object = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandShakeScreen();

    virtual EventCommand * getCommand() const;

protected:
    SystemCommonObject *m_object;
    QStandardItemModel *m_parameters;

    void initializePrimitives();
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandShakeScreen *ui;

    void translate();
};

#endif // DIALOGCOMMANDSHAKESCREEN_H
