/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCALLACOMMONREACTION_H
#define DIALOGCOMMANDCALLACOMMONREACTION_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandCallACommonReaction
//
//  A dialog used for calling a common reaction.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandCallACommonReaction;
}

class DialogCommandCallACommonReaction : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandCallACommonReaction(EventCommand *command = nullptr,
        QWidget *parent = nullptr);
    virtual ~DialogCommandCallACommonReaction();

    virtual EventCommand * getCommand() const;

protected:
    QStandardItemModel *m_modelParameters;

    void initializePrimitives();
    void clearParameters();

    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandCallACommonReaction *ui;

public slots:
    void on_comboBoxCommonReaction_currentIndexChanged(int index);
};

#endif // DIALOGCOMMANDCALLACOMMONREACTION_H
