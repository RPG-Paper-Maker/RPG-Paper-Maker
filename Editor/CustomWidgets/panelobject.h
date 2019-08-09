/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELOBJECT_H
#define PANELOBJECT_H

#include <QCheckBox>
#include <QPushButton>
#include "systemcommonobject.h"
#include "widgettreecommands.h"
#include "systemstate.h"

// -------------------------------------------------------
//
//  CLASS PanelObject
//
//  The object panel for common and local objects.
//
// -------------------------------------------------------

namespace Ui {
class PanelObject;
}

class PanelObject : public QWidget
{
    Q_OBJECT

public:
    explicit PanelObject(QWidget *parent = nullptr);
    virtual ~PanelObject();

    void deleteStateModel();
    void initializeList(QStandardItemModel *list);
    void updateList();
    void initializeModel(SystemCommonObject *object);
    void updateModel();
    void clear();
    void setInheritanceName(int index, QString name);
    void initializeCommonInheritance();
    void showStateWidgets(bool b);
    void showName(bool b);
    void updateReactions();
    void updateReactionsWidgets();
    SystemState * getSelectedState() const;
    void updateStateOptions(SystemState *state);
    void passToSprite();
    void passToNone();

private:
    Ui::PanelObject *ui;
    SystemCommonObject *m_model;
    QStandardItemModel *m_list;
    QVector<WidgetTreeCommands *> m_reactions;
    QVector<QCheckBox *> m_checkBoxes;
    QVector<QPushButton *> m_pushButtons;
    SystemReaction *m_copiedReaction;

private slots:
    void on_lineEditName_textChanged(const QString &text);
    void on_checkBoxOneEventPerFrame_toggled(bool checked);
    void on_comboBoxInheritance_currentIndexChanged(int index);
    void on_updateJsonStates(SuperListItem *);
    void on_updateJsonEvents(SuperListItem *);
    void on_updateJsonProperties(SuperListItem *);
    void on_stateChanged(QModelIndex index, QModelIndex);
    void on_eventChanged(QModelIndex index, QModelIndex);
    void on_tabWidgetCommands_currentChanged(int index);
    void on_blockingHeroChanged(bool c);
    void on_checkBoxMoveAnimation_toggled(bool checked);
    void on_checkBoxStopAnimation_toggled(bool checked);
    void on_checkBoxDirectionFix_toggled(bool checked);
    void on_checkBoxThrough_toggled(bool checked);
    void on_checkBoxSetWithCamera_toggled(bool checked);
    void on_checkBoxPixelOffset_toggled(bool checked);
    void on_comboBoxGraphics_currentIndexChanged(int index);
    void on_copyReaction();
    void on_pasteReaction();
};

#endif // PANELOBJECT_H
